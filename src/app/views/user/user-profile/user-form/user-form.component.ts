import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpecialityType} from '../../../../../types/speciality.type';
import {UserFullInfoType} from '../../../../../types/user-full-info.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';

@Component({
  selector: 'user-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NgClass
  ],
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnDestroy {
  @Input()
  userInfo: UserFullInfoType | null | any = null;
  @Input()
  userId: string | null = null;
  @Input()
  isMaster: boolean = false;

  maxSpecialityCount: number = 3;
  specialityCount: number[] = [0];
  userFormDisabled: boolean = true
  oldState: null | { [key: string]: string | {} } = null;
  getProfileInfoSubscription: Subscription | null = null;

  userInfoForm: any = this.fb.group({
    first_name: [{value: '', disabled: true,}],
    last_name: [{value: '', disabled: true,}],
    email: [{value: '', disabled: true,}],
    city: [{value: '', disabled: true,}],
    youtube: [{value: '', disabled: true,}],
    telegram: [{value: '', disabled: true,}],
    vk: [{value: '', disabled: true,}],
    instagram: [{value: '', disabled: true,}],
    phone: [{value: '', disabled: true,}],
    about_me: [{value: '', disabled: true,}],
    specialities: this.fb.group({
      speciality0: {value: '', disabled: true,},
      experience_since0: {value: '', disabled: true,}
    })
  })

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.fillForm()
  }

  fillForm() {
    this.specialityCount = [0]
    if (this.userInfo) {
      for (let control of Object.keys(this.userInfoForm.controls)) {
        if (!control.includes('specialit')) {
          this.userInfoForm.get(control)?.setValue(this.userInfo[control])
        }
      }
      this.userInfo.specialities.forEach((speciality: SpecialityType, index: number) => {
        if (index === 0) {
          this.userInfoForm.get('specialities').get('speciality0').setValue(speciality.speciality)
          this.userInfoForm.get('specialities').get('experience_since0').setValue(speciality.experience_since)
        } else {
          this.userInfoForm.get('specialities').addControl('speciality' + index, this.fb.control({
            value: '',
            disabled: true,
          }));
          this.userInfoForm.get('specialities').get('speciality' + index).setValue(speciality.speciality);
          this.userInfoForm.get('specialities').addControl('experience_since' + index, this.fb.control({
            value: '',
            disabled: true,
          }));
          this.userInfoForm.get('specialities').get('experience_since' + index).setValue(speciality.experience_since);
          this.specialityCount.push(index)
        }
      });
    }
  }

  allowEdit() {
    this.userInfoForm.enable();
    this.userFormDisabled = false;
    this.oldState = this.userInfoForm.value
  }

  saveChanges() {

    this.userFormDisabled = true;
    this.userInfoForm.disable();
    let changes: { [key: string]: string | {} | number | boolean } = {}
    let hasChanged: boolean = false
    const newState = this.userInfoForm.value
    if (this.oldState) {
      for (let key of Object.keys(this.oldState)) {
        if (key !== 'specialities') {
          if (this.oldState[key] !== newState[key]) {
            changes[key] = newState[key];
            hasChanged = true;
          }
        } else {
          if (JSON.stringify(this.oldState[key]) !== JSON.stringify(newState[key])) {
            changes[key] = newState[key];
            hasChanged = true;
          }
        }
      }
    }
    if (hasChanged && this.userId) {
      this.userService.updateProfileInfo(this.userId, changes).subscribe({
        next: (data: UserFullInfoType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this._snackBar.open('Данные успешно обновлены')
          const receivedProfileData = data as UserFullInfoType;
          this.userInfo = receivedProfileData;
          this.isMaster = receivedProfileData.status === 3;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка обновления данных')
          }
        }
      })
    } else {
      this._snackBar.open('Отсутствуют изменения для обновления')
    }

  }

  discardChanges() {
    if (this.userId) {
      this.getProfileInfoSubscription = this.userService.getProfileInfo(this.userId).subscribe({
        next: (data: UserFullInfoType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          const receivedProfileData = data as UserFullInfoType;
          this.userInfo = receivedProfileData;
          this.isMaster = receivedProfileData.status === 3;
          this.fillForm();
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail);
          } else {
            this._snackBar.open("Ошибка получения данных");
          }
        }
      });
    }
    this.userFormDisabled = true;
    this.userInfoForm.disable();
  }

  changePassword() {
    // ToDo request change password
    console.log('change password')
  }

  addPhone() {
    // ToDo request add phone
    console.log('add phone')
  }

  addSpeciality() {
    const newSpecialityIndex = this.specialityCount[this.specialityCount.length - 1] + 1;
    this.userInfoForm.get('specialities').addControl('speciality' + newSpecialityIndex, this.fb.control({
      value: '',
      disabled: false,
    }));
    this.userInfoForm.get('specialities').get('speciality' + newSpecialityIndex).setValue('');
    this.userInfoForm.get('specialities').addControl('experience_since' + newSpecialityIndex, this.fb.control({
      value: '',
      disabled: false,
    }));
    this.userInfoForm.get('specialities').get('experience_since' + newSpecialityIndex).setValue('');
    this.specialityCount.push(newSpecialityIndex)
  }

  ngOnDestroy() {
    this.getProfileInfoSubscription?.unsubscribe()
  }
}
