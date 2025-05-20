import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../../core/auth/auth.service';
import {UserService} from '../../../services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass} from '@angular/common';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {LoginResponseType} from '../../../../../types/login-response.type';
import {CommonUtils} from '../../../utils/common-utils';

@Component({
  selector: 'sign-up-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './sign-up-modal.component.html',
  styleUrl: './sign-up-modal.component.scss'
})
export class SignUpModalComponent implements OnDestroy {
  @Input()
  isOpen: boolean = true;

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() onLoginOpen: EventEmitter<boolean> = new EventEmitter(false);

  signUpForm = this.fb.group(
    {
      username: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: '',
      agree: [false, Validators.requiredTrue],
    },
    {
      validators: CommonUtils.matchValidator('password', 'confirmPassword')
    }
  )

  signUpSubscription: Subscription | null = null;
  isPasswordShowed: boolean = false;
  isConfirmPasswordShowed: boolean = false;

  constructor(private authService: AuthService,
              private userService: UserService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,) {
  }

  closeModal() {
    this.isOpen = false;
    this.signUpForm.reset()
    this.isPasswordShowed = false;
    this.isConfirmPasswordShowed = false;
    this.onCloseModal.emit(false)
  }

  signUp() {
    if (this.signUpForm.valid && this.signUpForm.value.password
      && this.signUpForm.value.username && this.signUpForm.value.confirmPassword && this.signUpForm.value.email) {
      const user = {
        username: this.signUpForm.value.username,
        password: this.signUpForm.value.password,
        email: this.signUpForm.value.email,
        phone: this.signUpForm.value.phone,
      }
      if (this.signUpForm.value.phone) {
        user.phone = this.signUpForm.value.phone
      }
      this.signUpSubscription = this.authService.signup(user).subscribe({
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
            loginResponse.firstName ? loginResponse.firstName : loginResponse.username
          );
          this._snackBar.open('Пользователь успешно зарегистрирован')
          this.closeModal()
        },
        error: (e) => {
          console.log(e)
          this._snackBar.open('Возникла ошибка при создании пользователя')
        }
      })
    }
  }

  togglePasswordShow(fieldName: 'isPasswordShowed' | 'isConfirmPasswordShowed') {
    this[fieldName] = !this[fieldName];
  }

  loginOpen() {
    this.closeModal();
    this.onLoginOpen.emit(true)
  }

  ngOnDestroy() {
    this.signUpSubscription?.unsubscribe();
  }
}
