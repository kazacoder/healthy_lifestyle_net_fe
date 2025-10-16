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
import {SignUpModalComponent} from '../../components/modals/sign-up-modal/sign-up-modal.component';
import {FeedbackService} from '../../services/feedback.service';
import {NotificationsWsResponseType} from '../../../../types/notificationsWsResponse.type';

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
    SignUpModalComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isOpenLoginModal: boolean = false;
  isOpenSignUpModal: boolean = false;
  isLogged: boolean = false;
  isLoggedSubscription: Subscription | null = null;
  userNameSubscription: Subscription | null = null;
  getNotificationsCount: Subscription | null = null;
  userName: string | null = null;
  notificationsCountSubscription: Subscription | null = null;
  notificationsCount: number | null = null;


  constructor(private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private feedbackService: FeedbackService,) {
  }

  toggleLoginModal(value: boolean) {
    this.isOpenLoginModal = value;
    WindowsUtils.fixBody(value);
  }

  toggleSignUpModal(value: boolean) {
    this.isOpenSignUpModal = value;
    WindowsUtils.fixBody(value);
  }

  ngOnInit() {
    this.isLoggedSubscription = this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.isLogged = isLogged;
      if (isLogged) {
        this.feedbackService.setCount();
      }
    })

    this.userNameSubscription = this.userService.userName$.subscribe((userName: string | null) => {
      this.userName = userName;
    })

    const userNameFromLocalStorage = this.userService.getUserName();
    if (userNameFromLocalStorage) {
      this.userName = userNameFromLocalStorage;
      this.isLogged = true;
    }
    this.notificationsCountSubscription = this.feedbackService.notificationsCount$.subscribe((count: number) => {
      this.notificationsCount = count;
    })
    this.feedbackService.connectWS()
    this.getNotificationsCount = this.feedbackService.getNotificationsCountWS().subscribe((data: NotificationsWsResponseType) => {
      this.notificationsCount = data.data.unread_count;
      this._snackBar.open('Вам пришло новое уведомление')
    })
  }

  ngOnDestroy() {
    this.isLoggedSubscription?.unsubscribe();
    this.notificationsCountSubscription?.unsubscribe();
    this.getNotificationsCount?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.userService.removeUserInfo();
    this._snackBar.open('Вы вышли из системы')
  }

}
