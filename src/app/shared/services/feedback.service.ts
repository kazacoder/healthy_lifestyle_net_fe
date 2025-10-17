import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, take, tap} from 'rxjs';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {NotificationType} from '../../../types/notification.type';
import {NotificationsCountType} from '../../../types/notifications-count.type';
import {NotificationsWsResponseType} from '../../../types/notificationsWsResponse.type';
import {Settings} from '../../../settings/settings';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private socket: WebSocket | null = null;
  private notificationsCountSubject = new Subject<NotificationsWsResponseType>();
  private needReconnect: boolean = false;

  notificationsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private accessTokenKey = Settings.accessTokenKey;

  constructor(private http: HttpClient) {
  }

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

  //ws

  connectWS(reconnect: boolean = false) {
    if (this.socket && !reconnect || this.socket && reconnect && this.needReconnect) {
      this.socket.close()
    }

    const token = localStorage.getItem(this.accessTokenKey);
    const host = environment.host;

    if (token && !reconnect || reconnect && this.needReconnect) {
      this.socket = new WebSocket(`ws://${host}/ws/feedback/notifications/`, ['jwt', token ? token : 'null']);
      this.needReconnect = false;
    }

    if (this.socket) {
      this.socket.onopen = () => {
        if (reconnect) {
          console.log('🔄 Reconnected to WebSocket');
        } else {
          console.log('✅ Connected to WebSocket');
        }
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'notification') {
          this.notificationsCountSubject.next(data);
        }
      };

      this.socket.onclose = async (event) => {
        console.log(event)
        if (event.code === 1000) {
          console.log('⚠️ WebSocket closed');
        } else if (event.code === 4401) {
          this.needReconnect = true;
          console.warn("🔑 Token is invalid.");
          console.warn('⚠️ WebSocket closed');
        } else if (event.code === 4402) {
          console.warn('⚠️ Token not provided. WebSocket closed');
        } else {
          console.warn('⚠️ WebSocket closed');
        }
      };

      this.socket.onerror = () => {
        console.error('❌ WebSocket error, closing...');
        this.socket?.close();
      };
    }
  }

  disconnectWS(closeStatus: number | undefined = undefined) {
    this.socket?.close(closeStatus);
    this.socket = null;
  }

  getNotificationsCountWS(): Observable<NotificationsWsResponseType> {
    return this.notificationsCountSubject.asObservable()
  }
}
