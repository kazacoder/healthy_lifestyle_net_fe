import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {catchError, map, of} from 'rxjs';
import {UserService} from '../services/user.service';

export class CustomValidator {
  static existingValueValidator(userService: UserService,
                                fieldName: 'username' | 'email',
                                initialValue: null | string = null):AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value || control.value === initialValue) {
        return of(null);
      }

      return userService.checkIfExist(fieldName, control.value).pipe(
        map(exists => (exists ? {valueExist: true} : null)),
        catchError(() => of(null))
      )
    }
  }
}
