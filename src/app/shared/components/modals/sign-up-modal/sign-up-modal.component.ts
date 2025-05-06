import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../../core/auth/auth.service';
import {UserService} from '../../../services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass} from '@angular/common';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {UserFullInfoType} from '../../../../../types/user-full-info.type';

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

  signUpForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    agree: [false, Validators.requiredTrue],
  })

  signUpSubscription: Subscription | null = null;
  userInfoSubscription: Subscription | null = null;
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

  signUp () {
    if (this.signUpForm.valid && this.signUpForm.value.password
      && this.signUpForm.value.username && this.signUpForm.value.confirmPassword && this.signUpForm.value.email) {
      //ToDO request and logic
      const user  = {
        username: this.signUpForm.value.username,
        password: this.signUpForm.value.password,
        email: this.signUpForm.value.email,
        phone: this.signUpForm.value.phone,
      }
      if (this.signUpForm.value.phone) {
        user.phone = this.signUpForm.value.phone
      }
      this.signUpSubscription = this.authService.signup(user).subscribe({
        next: (data: UserFullInfoType | DefaultResponseType) => {
          console.log(data)
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
    this.userInfoSubscription?.unsubscribe;
  }
}
