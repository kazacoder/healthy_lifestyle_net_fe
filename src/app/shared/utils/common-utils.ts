import {AbstractControl, ValidatorFn} from '@angular/forms';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';

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

  static getRussianMonthName(dateString: string, capitalize: boolean = true, returnDate: boolean = false): string {
    const date = new Date(dateString);
    const day = returnDate ? date.getDate() + ' ' : '';
    const formatted = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long'
    }).format(date);
    const month = formatted.split(' ')[1];
    if (capitalize) {
      return day + month.charAt(0).toUpperCase() + month.slice(1);
    }
    return day + month;
  }

  static getTicketWord(count: number): string {
    const abs = Math.abs(count);       // учитываем возможный минус
    const mod100 = abs % 100;
    const mod10 = abs % 10;

    if (mod100 >= 11 && mod100 <= 14) {
      return  `${count.toString()} билетов`;
    }
    if (mod10 === 1) {
      return `${count.toString()} билет`;
    }
    if (mod10 >= 2 && mod10 <= 4) {
      return `${count.toString()} билета`;
    }
    return `${count.toString()} билетов`;
  }

  static getNewWord(count: number): string {
    const abs = Math.abs(count);       // учитываем возможный минус
    const mod100 = abs % 100;
    const mod10 = abs % 10;

    if (mod100 >= 11 && mod100 <= 14) {
      return  `${count.toString()} новых`;
    }
    if (mod10 === 1) {
      return `${count.toString()} новый`;
    }
    return `${count.toString()} новых`;
  }

  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static getDurationLabel(amount: number, period: number): string {
    const getPlural = (value: number, forms: [string, string, string]): string => {
      const mod10 = value % 10;
      const mod100 = value % 100;

      if (mod10 === 1 && mod100 !== 11) return forms[0]; // "час"
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]; // "часа"
      return forms[2]; // "часов"
    };

    if (period === 1) {
      // Часы
      return `${amount} ${getPlural(amount, ['час', 'часа', 'часов'])}`;
    } else if (period === 2) {
      // Дни
      return `${amount} ${getPlural(amount, ['день', 'дня', 'дней'])}`;
    } else {
      return ''; // Неверный период
    }
  }

  static getRandomItems<T>(array: T[], count: number): T[] {
    const minCount = Math.min(count, array.length)
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, minCount);
  }

}

export const highlightWeekend: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
  if (view === 'month') {
    const day = cellDate.getDay();
    return (day === 0 || day === 6) ? 'mat-calendar-weekend' : '';
  }
  return '';
};
