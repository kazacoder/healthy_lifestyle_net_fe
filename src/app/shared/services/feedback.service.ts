import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, take, tap} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {NotificationType} from '../../../types/notification.type';
import {NotificationsCountType} from '../../../types/notifications-count.type';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  notificationsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  getNotificationList(): Observable<NotificationType[] | DefaultResponseType> {
    return this.http.get<NotificationType[] | DefaultResponseType>(environment.api + 'feedback/notifications/');
  }


  markNotificationAsRead(id: number): Observable<NotificationType[] | DefaultResponseType> {
    return this.http.patch<NotificationType[] | DefaultResponseType>(environment.api + `feedback/notifications/${id}/`, {is_read: true});
  }

  getNotificationsCount(): Observable<NotificationsCountType | DefaultResponseType> {
    return this.http.get<NotificationsCountType | DefaultResponseType>(environment.api + 'feedback/notifications_count/')
      .pipe(
        tap(count => {
          if (!count.hasOwnProperty('error') && !count.hasOwnProperty('detail')) {
            this.notificationsCount$.next((count as NotificationsCountType).count)
          }
        })
      );
  }

  setCount() {
    this.getNotificationsCount().pipe(take(1)).subscribe()
  }
}
