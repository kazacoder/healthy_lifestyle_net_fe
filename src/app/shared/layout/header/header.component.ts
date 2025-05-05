import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {LoginModalComponent} from "../../components/modals/login-modal/login-modal.component";
import {WindowsUtils} from '../../utils/windows-utils';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../core/auth/auth.service';
import {UserService} from '../../services/user.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    LoginModalComponent,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isOpenLoginModal: boolean = false;
  isLogged: boolean = false;
  isLoggedSubscription: Subscription | null = null;
  userNameSubscription: Subscription | null = null;
  userName: string | null = null;

  constructor(private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,) {
  }

  toggleLoginModal(value: boolean) {
    this.isOpenLoginModal = value;
    WindowsUtils.fixBody(value);
  }

  ngOnInit() {
    this.isLoggedSubscription = this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.isLogged = isLogged;
    })

    this.userNameSubscription = this.userService.userName$.subscribe((userName: string | null) => {
      this.userName = userName;
    })

    const userNameFromLocalStorage = this.userService.getUserName();
    if (userNameFromLocalStorage) {
      this.userName = userNameFromLocalStorage;
      this.isLogged = true;
    }
  }

  ngOnDestroy() {
    this.isLoggedSubscription?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.userService.removeUserInfo();
    this._snackBar.open('Вы вышли из системы')
  }

}
