import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthForwardGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    console.log('test guard')
    console.log(this.authService.getIsLoggedIn())
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/']).then();
      return false;
    }
    return true;
  }
}
