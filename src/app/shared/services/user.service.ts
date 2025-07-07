import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {UserInfoType} from '../../../types/user-info.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {UserFullInfoType} from '../../../types/user-full-info.type';
import {SpecialityType, UserSpecialityUpdateType} from '../../../types/speciality.type';
import {UserPhotoDeleteType, UserPhotoType} from '../../../types/user-photo.type';
import {UserChangePassType} from '../../../types/user-change-pass.type';
import {AdditionalImageType} from '../../../types/additional-image.type';
import {UserGenderType} from '../../../types/user-gender.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userNameKey: string = 'userName';
  userIdKey: string = 'userId';
  userStatusKey: string = 'userStatus';
  userName$: Subject<string | null> = new Subject<string | null>();
  isMaster: boolean = false;
  private isMaster$: Subject<boolean> = new Subject<boolean>();
  private isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isMasterObservable = this.isMaster$.asObservable();
  isLoggedObservable = this.isLogged$.asObservable();

  constructor(private http: HttpClient) {
    this.isMaster = localStorage.getItem(this.userStatusKey) === '3'
    this.setIsMaster(this.isMaster);
    if (this.getUserId()) {
      this.setIsLogged(true)
    }
  }

  setIsMaster(isMaster: boolean): void {
    this.isMaster$.next(isMaster);
  }

  setIsLogged(isLogged: boolean): void {
    this.isLogged$.next(isLogged);
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'user-info/');
  }


  getProfileInfo(user_id: string): Observable<UserFullInfoType | DefaultResponseType> {
    return this.http.get<UserFullInfoType | DefaultResponseType>(environment.api + 'users/' + user_id + '/');
  }

  getGenderList(): Observable<UserGenderType[] | DefaultResponseType> {
    return this.http.get<UserGenderType[] | DefaultResponseType>(environment.api + 'user/gender-choices/');
  }

  getAdditionalPhoto(): Observable<AdditionalImageType[] | DefaultResponseType> {
    return this.http.get<AdditionalImageType[] | DefaultResponseType>(environment.api + 'add-user-images/');
  }

  updateAdditionalPhoto (id: string, formData: FormData): Observable<AdditionalImageType[] | DefaultResponseType> {
    return this.http.patch<AdditionalImageType[] | DefaultResponseType>(environment.api + 'add-user-images/' + id  + '/', formData);
  }

  updateProfileInfo(user_id: string, value: {[key: string]: boolean | null | number | string | {}}):
    Observable<UserFullInfoType | DefaultResponseType> {
    return this.http.patch<UserFullInfoType | DefaultResponseType>(environment.api + 'users/' + user_id + '/', value);
  }

  updateUserSpecialityList(data: UserSpecialityUpdateType): Observable<SpecialityType[] | DefaultResponseType> {
    return this.http.post<SpecialityType[] | DefaultResponseType>(environment.api + 'user/specialities/', data);
  }

  uploadUserPhoto(data: FormData): Observable<UserPhotoType | DefaultResponseType> {
    return this.http.post<UserPhotoType | DefaultResponseType>(environment.api + 'user/upload-photo/', data);
  }

  deleteUserPhoto(): Observable<UserPhotoDeleteType | DefaultResponseType> {
    return this.http.delete<UserPhotoDeleteType | DefaultResponseType>(environment.api + 'user/upload-photo/');
  }

  changePassword(data: {old_password: string, new_password: string}): Observable<UserChangePassType | DefaultResponseType> {
    return this.http.put<UserChangePassType | DefaultResponseType>(environment.api + 'user/change-password/', data);
  }

  setUserInfo(user_id: string, username: string, userStatus: number): void {
    this.userName$.next(username);
    this.isMaster = userStatus === 3;
    this.setIsMaster(userStatus === 3);
    localStorage.setItem(this.userIdKey, user_id);
    localStorage.setItem(this.userNameKey, username);
    localStorage.setItem(this.userStatusKey, userStatus.toString());
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }

  getIsMaster(): boolean {
    return localStorage.getItem(this.userStatusKey) === '3';
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  removeUserInfo(): void {
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userNameKey);
    localStorage.removeItem(this.userStatusKey);
    this.userName$.next(null);
    this.setIsMaster(false);
  }

}
