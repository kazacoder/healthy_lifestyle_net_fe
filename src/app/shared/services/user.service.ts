import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {UserInfoType} from '../../../types/user-info.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userNameKey: string = 'userName';
  userIdKey: string = 'userId';
  userName$: Subject<string | null> = new Subject<string | null>();

  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'user-info/');
  }

  setUserInfo(user_id: string, username: string): void {
    this.userName$.next(username);
    localStorage.setItem(this.userIdKey, user_id);
    localStorage.setItem(this.userNameKey, username);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  removeUserInfo(): void {
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userNameKey);
    this.userName$.next(null);
  }

}
