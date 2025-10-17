import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  throwError
} from 'rxjs';
import {AuthService} from './auth.service';
import {UserService} from '../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DefaultResponseType} from '../../../types/default-response.type';
import {Router} from '@angular/router';
import {TokensResponseType} from '../../../types/tokens-response.type';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

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

  private handleJwtExpiredError(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // очищаем перед новым refresh

      return this.authService.refresh().pipe(
        switchMap((result: DefaultResponseType | TokensResponseType) => {
          this.isRefreshing = false;

          const refreshResult = result as TokensResponseType;
          if (!refreshResult.access || !refreshResult.refresh) {
            throw new Error('Ошибка авторизации');
          }

          this.authService.setTokens(refreshResult.access, refreshResult.refresh);
          this.refreshTokenSubject.next(refreshResult.access); // оповещаем всех ожидающих

          const cloned = req.clone({
            setHeaders: { Authorization: refreshResult.access },
          });

          return next.handle(cloned);
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null); // очищаем, чтобы не зависло состояние
          this.authService.removeTokens();
          this.userService.removeUserInfo();
          this._snackBar.open('Что-то пошло не так. Авторизуйтесь заново.');
          this.router.navigate(['/']).then();
          return throwError(() => error);
        })
      );
    } else {
      // другие запросы ждут окончания refresh
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(accessToken => {
          const cloned = req.clone({
            setHeaders: { Authorization: accessToken! },
          });
          return next.handle(cloned);
        })
      );
    }
  }

}
