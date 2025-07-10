import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpecialityType, UserSpecialityType, UserSpecialityUpdateType} from '../../../../../types/speciality.type';
import {UserFullInfoType} from '../../../../../types/user-full-info.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {SpecialityService} from '../../../../shared/services/speciality.service';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {WindowsUtils} from '../../../../shared/utils/windows-utils';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatDatepicker, MatDatepickerInput, MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {CommonUtils, highlightWeekend} from '../../../../shared/utils/common-utils';
import {UserGenderType} from '../../../../../types/user-gender.type';

@Component({
  selector: 'user-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NgClass,
    ChangePasswordComponent,
    NgSelectModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    MatDatepickerModule,
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
  userFormDisabled: boolean = true
  oldState: null | { [key: string]: string | {} } = null;
  getProfileInfoSubscription: Subscription | null = null;
  getSpecialityListSubscription: Subscription | null = null;
  getGenderListSubscription: Subscription | null = null;
  updateUserSpecialityListSubscription: Subscription | null = null;
  specialityList: SpecialityType[] = [];
  genderList: UserGenderType[] = [];
  specialityObj: { [key: number]: string } = {};
  genderObj: { [key: string]: string } = {};
  isOpenPasswordModal: boolean = false;


  // ToDO add validation
  // ToDO change password logic
  // ToDO realize phone adding
  userInfoForm: any = this.fb.group({
    first_name: [{value: '', disabled: true,}, Validators.required],
    last_name: [{value: '', disabled: true,}],
    email: [{value: '', disabled: true,}, [Validators.required, Validators.email]],
    city: [{value: '', disabled: true,}],
    youtube: [{value: '', disabled: true,}],
    telegram: [{value: '', disabled: true,}],
    vk: [{value: '', disabled: true,}],
    instagram: [{value: '', disabled: true,}],
    phone: [{value: '', disabled: true,}, Validators.required],
    about_me: [{value: '', disabled: true,}, Validators.maxLength(500)],
    short_description: [{value: '', disabled: true,}, Validators.maxLength(75)],
    gender: [{value: '', disabled: true,}, Validators.required],
    specialities: this.fb.array([
      this.fb.group({
        speciality: {value: '', disabled: true,},
        experienceSince: {value: '', disabled: true,},
        userSpecialityId: {value: null, disabled: true,}
      })
    ])
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
        const receivedSpecialityList = data as SpecialityType[]
        this.specialityList = receivedSpecialityList;
        receivedSpecialityList.forEach(item => {
          this.specialityObj[item.id] = item.title
        })
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных')
        }
      }
    });

    this.getGenderListSubscription = this.userService.getGenderList().subscribe({
      next: (data: UserGenderType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        const receivedGenderList = data as UserGenderType[]
        this.genderList = receivedGenderList;
        receivedGenderList.forEach(item => {
          this.genderObj[item.value] = item.label
        })
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных')
        }
      }
    });

  }

  togglePasswordModal(value: boolean) {
    this.isOpenPasswordModal = value;
    WindowsUtils.fixBody(value);
  }

  fillForm() {
    if (this.userInfo) {
      for (let control of Object.keys(this.userInfoForm.controls)) {
        if (!control.includes('specialit')) {
          this.userInfoForm.get(control)?.setValue(this.userInfo[control])
        }
      }
      this.fillSpecialitySelect();
    }
  }

  fillSpecialitySelect(disableControls: boolean = true) {
    if (this.userInfo.specialities.length > 0) {
      const userInfoFormSpecialitiesControl = this.userInfoForm.get('specialities')
      userInfoFormSpecialitiesControl.clear()
      this.userInfo.specialities.forEach((speciality: UserSpecialityType) => {
        userInfoFormSpecialitiesControl.push(this.fb.group({
          speciality: [{value: speciality.speciality_id, disabled: disableControls,}, Validators.required],
          experienceSince: [{value: speciality.experience_since, disabled: disableControls,}, Validators.required],
          userSpecialityId: {value: speciality.id.toString(), disabled: disableControls,}
        }))
      });
    }
  }

  allowEdit() {
    this.userInfoForm.enable();
    this.userFormDisabled = false;
    this.oldState = this.userInfoForm.value
  }

  saveChanges() {

    if (this.userInfoForm.valid) {
      this.userFormDisabled = true;
      this.userInfoForm.disable();
      let changes: { [key: string]: string | {} | number | boolean } = {}
      let userSpecialities: { [key: string]: string | number } = {}
      let hasChanged: boolean = false
      let hasChangedSpec: boolean = false
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
              hasChangedSpec = true;
            }
          }
        }
      }
      if (hasChanged && Object.keys(changes).length > 0) {
        this.updateUserInfo(changes)
      }
      const userSpecialitiesArray = this.userInfoForm.get('specialities').controls

      if (hasChangedSpec && userSpecialitiesArray.length > 0 && this.userId) {
        const userSpecialityUpdateList: UserSpecialityUpdateType = {user: this.userId, specialities: []}

        if (userSpecialitiesArray.length > 1 || (userSpecialitiesArray[0].value.experienceSince !== ''
          && userSpecialitiesArray[0].value.speciality !== '')) {
          userSpecialitiesArray.forEach((userSpeciality: FormGroup) => {
            userSpecialityUpdateList.specialities.push({
              experience_since: userSpeciality.get('experienceSince')?.dirty ? CommonUtils.formatDate(userSpeciality.value.experienceSince) : userSpeciality.value.experienceSince,
              speciality_id: userSpeciality.value.speciality,
              id: userSpeciality.value.userSpecialityId,
            })
          })
        }
        this.updateUserSpeciality(userSpecialityUpdateList)
      }
      if (!hasChanged && !hasChangedSpec) {
        this._snackBar.open('Отсутствуют изменения для обновления')
      }
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

  addPhone() {
    // ToDo request add phone
    console.log('add phone')
  }

  addSpeciality() {
    const userInfoFormSpecialitiesControl = this.userInfoForm.get('specialities')
    userInfoFormSpecialitiesControl.push(this.fb.group({
      speciality: ['', Validators.required],
      experienceSince: ['', Validators.required],
      userSpecialityId: null
    }))
  }


  delSpeciality(controlIndex: number) {
    const specialityCtrl = this.userInfoForm.get('specialities')
    if (specialityCtrl.controls.length > 1) {
      specialityCtrl.removeAt(controlIndex);
    } else {
      specialityCtrl.clear()
      specialityCtrl.push(this.fb.group({
        speciality: '',
        experienceSince: '',
        userSpecialityId: null
      }))
    }
  }

  getSpecialityValidity(arrIndex: number, ctrlName: string) {
    const ctrl = this.userInfoForm.get('specialities').controls[arrIndex].get([ctrlName])
    return ctrl.invalid && (ctrl?.dirty || ctrl?.touched)
  }

  getControlValidity(ctrlName: string) {
    const ctrl = this.userInfoForm.get([ctrlName])
    return ctrl.invalid && (ctrl?.dirty || ctrl?.touched) ? ctrl.errors : null
  }

  preventInput(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnDestroy() {
    this.getProfileInfoSubscription?.unsubscribe();
    this.getSpecialityListSubscription?.unsubscribe();
    this.getGenderListSubscription?.unsubscribe();
    this.updateUserSpecialityListSubscription?.unsubscribe();
  }

  protected readonly highlightWeekend = highlightWeekend;
}
