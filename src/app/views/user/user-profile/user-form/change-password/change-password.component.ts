import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {NgClass, NgIf} from '@angular/common';
import {CloseBtnMobComponent} from '../../../../../shared/components/ui/close-btn-mob/close-btn-mob.component';
import {CommonUtils} from '../../../../../shared/utils/common-utils';
import {DefaultResponseType} from '../../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {UserChangePassType} from '../../../../../../types/user-change-pass.type';
import {ErrorResponseType} from '../../../../../../types/eroor-response.type';
import {Settings} from '../../../../../../settings/settings';

@Component({
  selector: 'change-password',
  imports: [
    NgClass,
    ReactiveFormsModule,
    CloseBtnMobComponent,
    NgIf,
  ],
  standalone: true,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnDestroy {
  @Input() isOpen: boolean = true;
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);
  errors: ErrorResponseType | null = null;
  changePasswordForm = this.fb.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(Settings.passwordRegex)]],
      confirmPassword: '',
    },
    {
      validators: CommonUtils.matchValidator('newPassword', 'confirmPassword')
    }
  )
  changePasswordSubscription: Subscription | null = null;
  isOldPasswordShowed: boolean = false;
  isNewPasswordShowed: boolean = false;
  isConfirmPasswordShowed: boolean = false;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,) {
  }

  proceed() {

    if (this.changePasswordForm.valid) {
      const data = {
        old_password: this.changePasswordForm.get('oldPassword')?.value as string,
        new_password: this.changePasswordForm.get('newPassword')?.value as string,
      }
      this.changePasswordSubscription = this.userService.changePassword(data).subscribe({
        next: (data: UserChangePassType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this._snackBar.open('Пароль успешно изменен');
          this.closeModal();
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.errors = errorResponse.error as ErrorResponseType;
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail);
          } else {
            this._snackBar.open("Ошибка обновления пароля");
          }
        }
      });
    }
  }

  closeModal() {
    this.isOpen = false;
    this.changePasswordForm.reset()
    this.isOldPasswordShowed = false;
    this.isNewPasswordShowed = false;
    this.isConfirmPasswordShowed = false;
    this.onCloseModal.emit(false)
  }

  togglePasswordShow(fieldName: 'isOldPasswordShowed' | 'isNewPasswordShowed' | 'isConfirmPasswordShowed') {
    this[fieldName] = !this[fieldName];
  }

  ngOnDestroy() {
    this.changePasswordSubscription?.unsubscribe();
  }
}
