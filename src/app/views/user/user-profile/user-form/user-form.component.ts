import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpecialityType} from '../../../../../types/speciality.type';
import {UserFullInfoType} from '../../../../../types/user-full-info.type';

@Component({
  selector: 'user-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit{
  @Input()
  userInfo: UserFullInfoType | null | any = null;
  @Input()
  userId: string | null = null;
  @Input()
  isMaster: boolean = false;

  specialityCount: number[] = [0];

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
          this.userInfoForm.get('specialities').addControl('speciality' + index, this.fb.control({value: '', disabled: true,}));
          this.userInfoForm.get('specialities').get('speciality' + index).setValue(speciality.speciality);
          this.userInfoForm.get('specialities').addControl('experience_since' + index, this.fb.control({value: '', disabled: true,}));
          this.userInfoForm.get('specialities').get('experience_since' + index).setValue(speciality.experience_since);
          this.specialityCount.push(index)
        }
      });
      console.log();
    }
  }

  allowEdit() {
    this.userInfoForm.enable()
  }
}
