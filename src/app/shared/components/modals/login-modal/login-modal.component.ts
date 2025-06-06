import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass} from '@angular/common';
import {PassFieldComponent} from '../../ui/pass-field/pass-field.component';
import {AuthService} from '../../../../core/auth/auth.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {LoginResponseType} from '../../../../../types/login-response.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'login-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass,
    PassFieldComponent,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent implements OnDestroy {
  @Input()
  isOpen: boolean = true;

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() onSignUpOpen: EventEmitter<boolean> = new EventEmitter(false);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })

  loginSubscription: Subscription | null = null;
  isPasswordShowed: boolean = false;

  constructor(private authService: AuthService,
              private userService: UserService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,) {
  }

  closeModal() {
    this.isOpen = false;
    this.loginForm.reset()
    this.isPasswordShowed = false;
    this.onCloseModal.emit(false)
  }


  login() {

    if (this.loginForm.valid && this.loginForm.value.password && this.loginForm.value.username) {
      this.loginSubscription = this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (data: LoginResponseType | DefaultResponseType) => {
          let error = null;
          if ((data as DefaultResponseType).detail !== undefined) {
            error = (data as DefaultResponseType).detail;
          }

          const loginResponse = data as LoginResponseType;
          if (!loginResponse.access || !loginResponse.refresh) {
            error = 'Ошибка авторизации'
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.authService.setTokens(loginResponse.access, loginResponse.refresh);
          this.userService.setUserInfo(
            loginResponse.userId,
            loginResponse.firstName ? loginResponse.firstName : loginResponse.username,
            loginResponse.status
          );
          this.userService.setIsLogged(true);
          this._snackBar.open('Вы успешно авторизовались');
          this.closeModal();
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка авторизации')
          }
        },
      })
    }
  }

  togglePasswordShow() {
    this.isPasswordShowed = !this.isPasswordShowed;
  }

  singUpOpen() {
    this.closeModal();
    this.onSignUpOpen.emit(true)
  }

  ngOnDestroy() {
    this.loginSubscription?.unsubscribe();
  }
}
