import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {SpinnerComponent} from '../../../../shared/components/ui/spinner/spinner.component';
import {NgClass} from '@angular/common';
import {Subscription} from 'rxjs';
import {UserFullInfoType} from '../../../../../types/user-full-info.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'user-type',
  imports: [
    SpinnerComponent,
    NgClass,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './user-type.component.html',
  styleUrl: './user-type.component.scss'
})
export class UserTypeComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  userStatus: number = 1
  @Input()
  userId: string | null = null;

  buttonChangeTypeDisabled = false;
  formChangeSubscription: Subscription | null = null;
  changeUserStatusSubscription: Subscription | null = null;

  userTypeForm = this.fb.group({
    userType: [this.userStatus],
  })

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private _snackBar: MatSnackBar) {

  }


  changeUserType() {

    console.log(this.userId)
    console.log(this.userStatus)
    console.log(this.userTypeForm.value.userType)

    if (this.userId) {
      if (this.userStatus === 1 && this.userTypeForm.value.userType === 3) {
      console.log('upgrade')
        this.changeUserStatusSubscription = this.userService.updateProfileInfo(this.userId, {status: 2})
          .subscribe({
            next: (data: UserFullInfoType | DefaultResponseType) => {
              if ((data as DefaultResponseType).detail !== undefined) {
                const error = (data as DefaultResponseType).detail;
                this._snackBar.open(error);
                throw new Error(error);
              }
              this.userStatus = (data as UserFullInfoType).status
              this.userTypeForm.get('userType')?.disable();
              this.buttonChangeTypeDisabled = true;
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.detail) {
                this._snackBar.open(errorResponse.error.detail)
              } else {
                this._snackBar.open('Ошибка обновления данных')
              }
            }
          })
      } else if (this.userStatus === 3 && this.userTypeForm.value.userType === 1) {
        console.log('downgrade')
        this.changeUserStatusSubscription = this.userService.updateProfileInfo(this.userId, {status: 4})
          .subscribe({
            next: (data: UserFullInfoType | DefaultResponseType) => {
              if ((data as DefaultResponseType).detail !== undefined) {
                const error = (data as DefaultResponseType).detail;
                this._snackBar.open(error);
                throw new Error(error);
              }
              this.userStatus = (data as UserFullInfoType).status
              this.userTypeForm.get('userType')?.disable();
              this.buttonChangeTypeDisabled = true;
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.detail) {
                this._snackBar.open(errorResponse.error.detail)
              } else {
                this._snackBar.open('Ошибка обновления данных')
              }
            }
          })

      }
    }
  }

  ngOnChanges() {
    this.userTypeForm.valueChanges.subscribe(() => {
      this.buttonChangeTypeDisabled = this.userStatus === this.userTypeForm.value.userType
    })
  }

  ngOnInit() {
    this.userTypeForm.setValue({userType: this.userStatus})
    if (this.userStatus === 2 || this.userStatus === 4) {
      this.userTypeForm.get('userType')?.disable();
    } else {
      this.userTypeForm.get('userType')?.enable();
    }
    this.buttonChangeTypeDisabled = this.userStatus === 2 || this.userStatus === 4 ||
      this.userStatus === this.userTypeForm.value.userType
  }

  ngOnDestroy() {
    this.changeUserStatusSubscription?.unsubscribe();
    this.formChangeSubscription?.unsubscribe();
  }
}
