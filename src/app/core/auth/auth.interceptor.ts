import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {catchError, finalize, Observable, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {UserService} from '../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokens = this.authService.getTokens();

    if (tokens && !tokens.accessToken && tokens.refreshToken) {
      this.authService.logout();
      this.userService.removeUserInfo();
      this._snackBar.open('Что-то пошло не так. Авторизуйтесь заново.');
      throw new Error('Access token not found');
    }

    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: tokens.accessToken,
        },
      });
      return next.handle(authReq)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 500 && err.error.message === 'jwt expired' && !authReq.url.includes('/login')
              && !authReq.url.includes('/refresh')) {
              return this.handleJwtExpiredError(authReq, next);
            }
            return throwError(() => err);
          }),
          finalize(() => {
            // hide loader
          })
        );
    }

    return next.handle(req).pipe(finalize(() => {
      // hide loader
    }));

  }

  handleJwtExpiredError(req: HttpRequest<any>, next: HttpHandler) {
    return throwError(() => 'error');
  }
}
