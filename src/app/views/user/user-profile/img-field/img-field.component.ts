import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgOptimizedImage, NgStyle} from '@angular/common';
import {UserService} from '../../../../shared/services/user.service';
import {Subscription} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserPhotoDeleteType, UserPhotoType} from '../../../../../types/user-photo.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {ConfirmModalComponent} from '../../../../shared/components/modals/confirm-modal/confirm-modal.component';
import {WindowsUtils} from '../../../../shared/utils/windows-utils';

@Component({
  selector: 'img-field',
  imports: [
    NgOptimizedImage,
    NgStyle,
    ConfirmModalComponent
  ],
  standalone: true,
  templateUrl: './img-field.component.html',
  styleUrl: './img-field.component.scss'
})
export class ImgFieldComponent implements OnInit, OnDestroy {
  @Input()
  userPhotoUrl: string | null = null;

  userPhoto: string = 'assets/img/img.svg'
  uploadPhotoSubscription: Subscription | null = null;
  deletePhotoSubscription: Subscription | null = null;
  isOpenConfirmModal: boolean = false

  constructor(private userService: UserService,
              private _snackBar: MatSnackBar,) {

  }

  ngOnInit() {
    if (this.userPhotoUrl) {
      this.userPhoto = this.userPhotoUrl
      console.log(this.userPhoto )
    }
  }


  onFileSelected(event: Event, input: HTMLInputElement) {
    const filesList = (event.target as HTMLInputElement).files
    if (filesList) {
      const photo = filesList[0]
      if (photo) {
        const formData = new FormData();
        formData.append("file", photo);
        this.uploadPhotoSubscription = this.userService.uploadUserPhoto(formData).subscribe({
          next: (data: UserPhotoType | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            this.userPhoto = (data as UserPhotoType).photo;
            console.log(this.userPhoto )
            this._snackBar.open('Файл успешно загружен');
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
              console.log(errorResponse.error.detail)
            } else {
              this._snackBar.open('Ошибка загрузки файла')
            }
          },
        })
      }
    }
    input.value = ''
  }

  toggleDeleteModal(val: boolean) {
    this.isOpenConfirmModal = val;
    WindowsUtils.fixBody(val);
  }

  deleteUserPhoto() {
    this.deletePhotoSubscription = this.userService.deleteUserPhoto().subscribe({
      next: (data: UserPhotoDeleteType | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.userPhoto = 'assets/img/img.svg';
        this._snackBar.open('Фото удалено');
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
          console.log(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка выполнения запроса')
        }
      },
    })
    this.deletePhotoSubscription.add(() => {return this.toggleDeleteModal(false)})

  }

  ngOnDestroy() {
    this.uploadPhotoSubscription?.unsubscribe()
  }

}
