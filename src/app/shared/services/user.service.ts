import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {UserInfoType} from '../../../types/user-info.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {UserFullInfoType} from '../../../types/user-full-info.type';
import {SpecialityType, UserSpecialityUpdateType} from '../../../types/speciality.type';

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


  getProfileInfo(user_id: string): Observable<UserFullInfoType | DefaultResponseType> {
    return this.http.get<UserFullInfoType | DefaultResponseType>(environment.api + 'users/' + user_id + '/');
  }

  updateProfileInfo(user_id: string, value: {[key: string]: boolean | null | number | string | {}}):
    Observable<UserFullInfoType | DefaultResponseType> {
    return this.http.patch<UserFullInfoType | DefaultResponseType>(environment.api + 'users/' + user_id + '/', value);
  }

  updateUserSpecialityList(data: UserSpecialityUpdateType): Observable<SpecialityType[] | DefaultResponseType> {
    return this.http.post<SpecialityType[] | DefaultResponseType>(environment.api + 'user/specialities/', data);
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
