import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {LoginResponseType} from '../../../types/login-response.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {UserFullInfoType} from '../../../types/user-full-info.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessTokenKey: string = 'access';
  public refreshTokenKey: string = 'refresh';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'token/', {username, password})
  }

  signup(user: { password: string; phone: string | null | undefined; email: string; username: string }):
    Observable<UserFullInfoType | DefaultResponseType> {
    return this.http.post<UserFullInfoType | DefaultResponseType>(environment.api + 'auth/signup/', user)
  }

  logout(): void {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      // this.http.post<DefaultResponseType>(environment.api + 'logout',
      //   {refreshToken: tokens.refreshToken},);
    }
    this.removeTokens();
    // this.userId = null;
  }


  public getIsLoggedIn() {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged$.next(true);
    this.isLogged = true;
  }


  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }
}
