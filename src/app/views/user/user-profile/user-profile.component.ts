import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProfileNavComponent} from './profile-nav/profile-nav.component';
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
import {NgIf} from '@angular/common';
import {NotificationsType} from '../../../../types/notifications.type';


@Component({
  selector: 'app-user-profile',
  imports: [
    ProfileNavComponent,
    ImgFieldComponent,
    UserTypeComponent,
    UserSettingsComponent,
    UserFormComponent,
    NgIf
  ],
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit, OnDestroy {

  profileInfo: UserFullInfoType | null = null;
  userId: string | null = null;
  getProfileInfoSubscription: Subscription | null = null;
  notifications: NotificationsType | null = null;
  isMaster: boolean = false;


  constructor(private userService: UserService,
              private _snackBar: MatSnackBar,) {
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
    }
  }

  ngOnDestroy() {
    this.getProfileInfoSubscription?.unsubscribe()
  }

}
