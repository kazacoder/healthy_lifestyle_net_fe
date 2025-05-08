import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {catchError, finalize, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {UserService} from '../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DefaultResponseType} from '../../../types/default-response.type';
import {Router} from '@angular/router';
import {TokensResponseType} from '../../../types/tokens-response.type';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private router: Router) {}

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
            if (err.status === 401 && err.error.messages[0].message === 'Token is expired' && !authReq.url.includes('/login')
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
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | TokensResponseType) => {
          let error = '';
          if ((result as DefaultResponseType).detail !== undefined) {
            error = (result as DefaultResponseType).detail
          }

          const refreshResult = result as TokensResponseType

          if (!refreshResult.access || !refreshResult.refresh) {
            error = 'Ошибка авторизации'
          }

          if (error) {
            return throwError(() => error);
          }

          this.authService.setTokens(refreshResult.access, refreshResult.refresh);

          const authReq = req.clone({
            headers: req.headers.set('Authorization', refreshResult.access),
          });

          return next.handle(authReq)
        }),
        catchError(error => {
          this.authService.removeTokens();
          this.userService.removeUserInfo();
          this._snackBar.open('Что-то пошло не так. Авторизуйтесь заново.');
          this.router.navigate(['/']).then();
          return throwError(() => error);
        })
      )
  }
}
