import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  NotificationCardComponent
} from '../../../shared/components/cards/notification-card/notification-card.component';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FeedbackService} from '../../../shared/services/feedback.service';
import {Subscription} from 'rxjs';
import {NotificationType} from '../../../../types/notification.type';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [
    NotificationCardComponent,
    NgForOf
  ],
  standalone: true,
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit, OnDestroy {

  getNotificationsListSubscription: Subscription | null = null;
  notifications: NotificationType[] = [];

  constructor(private _snackBar: MatSnackBar,
              private feedbackService: FeedbackService,) {

  }

  ngOnInit() {
    this.getNotificationsList();
  }

  getNotificationsList() {
    this.getNotificationsListSubscription = this.feedbackService.getNotificationList().subscribe({
      next: (data: NotificationType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.notifications = data as NotificationType[];
        console.log(this.notifications)
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


  ngOnDestroy() {
    this.getNotificationsListSubscription?.unsubscribe();
  }
}
