import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {NotificationType} from '../../../types/notification.type';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  getNotificationList(): Observable<NotificationType[] | DefaultResponseType> {
    return this.http.get<NotificationType[] | DefaultResponseType>(environment.api + 'feedback/notifications/');
  }
}
