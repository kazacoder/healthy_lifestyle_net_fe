import {AbstractControl, ValidatorFn} from '@angular/forms';

export class CommonUtils {

  static formatYears(years: number): string {
    const lastDigit = years % 10;
    const lastTwoDigits = years % 100;

    let suffix;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      suffix = "лет";
    } else if (lastDigit === 1) {
      suffix = "год";
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      suffix = "года";
    } else {
      suffix = "лет";
    }

    return `${years} ${suffix}`;
  }


  static formatMonths(months: number) {
    const lastDigit = months % 10;
    const lastTwoDigits = months % 100;

    let suffix;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      suffix = "месяцев";
    } else if (lastDigit === 1) {
      suffix = "месяц";
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      suffix = "месяца";
    } else {
      suffix = "месяцев";
    }

    return `${months} ${suffix}`;
  }

  static formatPeriod(value: number, periodType: 'year' | 'month' = "year") {
    const lastDigit = value % 10;
    const lastTwoDigits = value % 100;

    let suffix;

    if (periodType === "month") {
      if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        suffix = "месяцев";
      } else if (lastDigit === 1) {
        suffix = "месяц";
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        suffix = "месяца";
      } else {
        suffix = "месяцев";
      }
    } else {
      // по умолчанию: "год"
      if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        suffix = "лет";
      } else if (lastDigit === 1) {
        suffix = "год";
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        suffix = "года";
      } else {
        suffix = "лет";
      }
    }

    return `${value} ${suffix}`;
  }

  static matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
        return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    }
  }
}
