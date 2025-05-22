import {AfterContentChecked, Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../../core/auth/auth.service';
import {UserService} from '../../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'profile-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgIf
  ],
  standalone: true,
  templateUrl: './profile-nav.component.html',
  styleUrl: './profile-nav.component.scss'
})
export class ProfileNavComponent implements AfterContentChecked {

  isMaster: boolean = false;
  isOpened: boolean = false;
  activeMenuItem: string | undefined = '';

  constructor(private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private router: Router,) {
    this.isMaster = this.userService.isMaster;
  }

  //ToDO ngDoCheck: вызывается при каждой проверке изменений свойств компонента сразу после методов ngOnChanges и ngOnInit

  //Todo add close mobile menu when click outside

  ngAfterContentChecked(): void {
    this.activeMenuItem = document.querySelector('.profile-nav__link._active')?.innerHTML
  }

  logout(): void {
    this.authService.logout();
    this.userService.removeUserInfo();
    this.router.navigate(['/']).then();
    this._snackBar.open('Вы вышли из системы')
  }

  toggleNav(): void {
    this.isOpened = !this.isOpened;
  }

}
