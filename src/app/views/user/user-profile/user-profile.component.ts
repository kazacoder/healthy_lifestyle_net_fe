import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImgFieldComponent} from './img-field/img-field.component';
import {UserTypeComponent} from './user-type/user-type.component';
import {UserSettingsComponent} from './user-settings/user-settings.component';
import {UserFormComponent} from './user-form/user-form.component';
import {UserService} from '../../../shared/services/user.service';
import {UserFullInfoType} from '../../../../types/user-full-info.type';
import {Subscription} from 'rxjs';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NotificationsType} from '../../../../types/notifications.type';
import {UploadItemComponent} from "../publication/detail/upload/upload-item/upload-item.component";
import {FormArray, FormBuilder} from '@angular/forms';
import {Settings} from '../../../../settings/settings';
import {AdditionalImageType} from '../../../../types/additional-image.type';


@Component({
  selector: 'app-user-profile',
  imports: [
    ImgFieldComponent,
    UserTypeComponent,
    UserSettingsComponent,
    UserFormComponent,
    NgIf,
    NgClass,
    NgForOf,
    UploadItemComponent
  ],
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit, OnDestroy {

  profileInfo: UserFullInfoType | null = null;
  userId: string | null = null;
  getProfileInfoSubscription: Subscription | null = null;
  getUserPhotosSubscription: Subscription | null = null;
  saveUserPhotosSubscription: Subscription | null = null;
  notifications: NotificationsType | null = null;
  isMaster: boolean = false;
  checkingProfile: boolean = false;
  existingFilesIds: number[] = [];
  maxAdditionUserPhotoCount = Settings.maxAdditionUserPhotoCount;
  additionalImagePreview: { file: string | ArrayBuffer | null, name: string, id: number | null }[] = [];
  userImagesForm: FormArray = this.fb.array([])


  constructor(private userService: UserService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder,) {
    this.userId = this.userService.getUserId()
  }

  ngOnInit() {
    if (this.userId) {
      this.getProfileInfoSubscription = this.userService.getProfileInfo(this.userId).subscribe({
        next: (data: UserFullInfoType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          const receivedProfileData = data as UserFullInfoType;
          this.profileInfo = receivedProfileData;
          this.isMaster = receivedProfileData.status === 3;
          this.checkingProfile = receivedProfileData.status === 4 || receivedProfileData.status === 2;
          this.notifications = {
            receiveNotificationsSite: receivedProfileData.receive_notifications_site,
            receiveNotificationsEmail: receivedProfileData.receive_notifications_email,
            receiveNotificationsEvents: receivedProfileData.receive_notifications_events,
            receiveNotificationsNews: receivedProfileData.receive_notifications_news,
            receiveNotificationsBooks: receivedProfileData.receive_notifications_books,
            receiveNotificationsQuestions: receivedProfileData.receive_notifications_questions,
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail);
          } else {
            this._snackBar.open("Ошибка получения данных");
          }
        }
      });

      this.getUserPhotosSubscription = this.userService.getAdditionalPhoto().subscribe({
        next: (data: AdditionalImageType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          const receivedUserPhotos = data as AdditionalImageType[];
          receivedUserPhotos.forEach(item => {
            this.existingFilesIds.push(item.id);
            this.additionalImagePreview.push({file: item.file, name: item.file, id: item.id});
          })
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
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    if (this.additionalImagePreview.length < Settings.maxAdditionUserPhotoCount) {
      if (this.additionalImagePreview.findIndex(item => item.name === file.name) === -1) {
        this.userImagesForm.push(
          this.fb.control({image: file})
        );
        reader.onload = () => {
          this.additionalImagePreview.push({file: reader.result, name: file.name, id: null});
        };
      }
    } else {
      this._snackBar.open(`Максимальное количество дополнительных фотографий ${Settings.maxAdditionUserPhotoCount}`)
    }
    this.userImagesForm.markAsDirty()
    this.userImagesForm.updateValueAndValidity()

    reader.readAsDataURL(file);
    input.value = '';
  }

  removeImage(fileName: string) {
    const index = this.userImagesForm.controls.findIndex(control => {
      return control.value.image.name === fileName;
    })
    this.userImagesForm.removeAt(index)

    this.existingFilesIds = []
    this.additionalImagePreview.forEach(item => {
      if (item.name !== fileName && item.id) {
        this.existingFilesIds.push(item.id);
      }
    });
    this.additionalImagePreview = [...this.additionalImagePreview.filter(item => item.name !== fileName)];
    this.userImagesForm.markAsDirty()
    this.userImagesForm.updateValueAndValidity()
  }

  buildImagesFormData(): FormData {
      const formData = new FormData();
      if (this.userImagesForm.dirty) {
        formData.append('existing_images', JSON.stringify(this.existingFilesIds));
        if (this.userImagesForm.length > 0) {
          this.userImagesForm.controls.forEach((control) => {
            formData.append('additional_images', control.value.image);
          })
        }
      }
      return formData;
  }

  save() {
    if (this.userId) {
      const formData = this.buildImagesFormData()
      this.saveUserPhotosSubscription = this.userService.updateAdditionalPhoto(this.userId, formData)
        .subscribe({
          next: (data: AdditionalImageType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            this._snackBar.open('Фото обновлены');
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
            } else {
              this._snackBar.open('Ошибка обновления фотографий')
            }
          }
        });
    }
  }

  ngOnDestroy() {
    this.getProfileInfoSubscription?.unsubscribe()
    this.getUserPhotosSubscription?.unsubscribe()
  }

  setChecking(val: boolean): void {
    this.checkingProfile = val;
  }

}
