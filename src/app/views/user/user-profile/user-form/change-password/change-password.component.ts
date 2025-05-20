import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {NgClass} from '@angular/common';
import {CloseBtnMobComponent} from '../../../../../shared/components/ui/close-btn-mob/close-btn-mob.component';
import {CommonUtils} from '../../../../../shared/utils/common-utils';

@Component({
  selector: 'change-password',
  imports: [
    NgClass,
    ReactiveFormsModule,
    CloseBtnMobComponent,
  ],
  standalone: true,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnDestroy {
  @Input()
  isOpen: boolean = true;

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);


  changePasswordForm = this.fb.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, ]],
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
    console.log(this.changePasswordForm.value)
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
