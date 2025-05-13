import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpecialityType, UserSpecialityType, UserSpecialityUpdateType} from '../../../../../types/speciality.type';
import {UserFullInfoType} from '../../../../../types/user-full-info.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {SpecialityService} from '../../../../shared/services/speciality.service';

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
  getSpecialityListSubscription: Subscription | null = null;
  updateUserSpecialityListSubscription: Subscription | null = null;
  specialityList: SpecialityType[] = [];

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
      speciality_0: {value: '', disabled: true,},
      experienceSince_0: {value: '', disabled: true,},
      userSpecialityId_0: {value: '', disabled: true,}
    })
  })

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private specialityService: SpecialityService,
              private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.fillForm()
    this.getSpecialityListSubscription = this.specialityService.getSpecialityList().subscribe({
      next: (data: SpecialityType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.specialityList = data as SpecialityType[];
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных')
        }
      }
    })
  }

  fillForm() {
    this.specialityCount = [0]
    if (this.userInfo) {
      for (let control of Object.keys(this.userInfoForm.controls)) {
        if (!control.includes('specialit')) {
          this.userInfoForm.get(control)?.setValue(this.userInfo[control])
        }
      }
      this.fillSpecialitySelect();
    }
  }

  fillSpecialitySelect() {
    this.userInfo.specialities.forEach((speciality: UserSpecialityType, index: number) => {
      if (index === 0) {
        this.userInfoForm.get('specialities').get('speciality_0').setValue(speciality.speciality_id.toString())
        this.userInfoForm.get('specialities').get('experienceSince_0').setValue(speciality.experience_since)
        this.userInfoForm.get('specialities').get('userSpecialityId_0').setValue(speciality.id.toString())
      } else {
        const specialitiesGroup = this.userInfoForm.get('specialities');
        specialitiesGroup.addControl('speciality_' + index, this.fb.control({
          value: '',
          disabled: true,
        }));
        specialitiesGroup.get('speciality_' + index).setValue(speciality.speciality_id.toString());
        specialitiesGroup.addControl('experienceSince_' + index, this.fb.control({
          value: '',
          disabled: true,
        }));
        specialitiesGroup.get('experienceSince_' + index).setValue(speciality.experience_since);
        specialitiesGroup.addControl('userSpecialityId_' + index, this.fb.control({
          value: '',
          disabled: true,
        }));
        specialitiesGroup.get('userSpecialityId_' + index).setValue(speciality.id.toString());
        this.specialityCount.push(index)
      }
    });
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
    let userSpecialities: { [key: string]: string | number  } = {}
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
            userSpecialities = newState[key];
            hasChanged = true;
          }
        }
      }
    }
    if (hasChanged && Object.keys(changes).length > 0) {
      this.updateUserInfo(changes)
    }
    const userSpecialitiesKeys = Object.keys(userSpecialities)

    if (hasChanged && userSpecialitiesKeys.length > 0 && this.userId) {
      const userSpecialityUpdateList: UserSpecialityUpdateType = {user: this.userId, specialities: []}
      for (let i = 0; i < userSpecialitiesKeys.length / 3; i++) {
        userSpecialityUpdateList.specialities.push({
          experience_since: userSpecialities['experienceSince_' + i] as string,
          speciality_id: userSpecialities['speciality_' + i] as number,
          id: userSpecialities['userSpecialityId_' + i] as number,
        })
      }
      this.updateUserSpeciality(userSpecialityUpdateList)
    }
    if (!hasChanged) {
      this._snackBar.open('Отсутствуют изменения для обновления')
    }

  }

  updateUserSpeciality(userSpecialityUpdateList: UserSpecialityUpdateType) {
    this.updateUserSpecialityListSubscription = this.userService.updateUserSpecialityList(userSpecialityUpdateList)
      .subscribe({
        next: (data: SpecialityType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.userInfo.specialities = data as SpecialityType[];
          this.fillSpecialitySelect();
          this._snackBar.open('Данные специализаций успешно обновлены');
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка получения данных')
          }
        }
      })

  }

  updateUserInfo(changes: { [key: string]: string | {} | number | boolean }) {
    if (this.userId) {
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
    this.getProfileInfoSubscription?.unsubscribe();
    this.getSpecialityListSubscription?.unsubscribe();
    this.updateUserSpecialityListSubscription?.unsubscribe();
  }
}
