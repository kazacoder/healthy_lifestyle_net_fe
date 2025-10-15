import {
  AfterContentChecked, ChangeDetectorRef,
  Component, ElementRef,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../../core/auth/auth.service';
import {UserService} from '../../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgClass, NgIf} from '@angular/common';
import {ConfirmModalComponent} from '../../../../shared/components/modals/confirm-modal/confirm-modal.component';
import {WindowsUtils} from '../../../../shared/utils/windows-utils';
import {Subscription} from 'rxjs';
import {FeedbackService} from '../../../../shared/services/feedback.service';

@Component({
  selector: 'profile-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgIf,
    ConfirmModalComponent
  ],
  standalone: true,
  templateUrl: './profile-nav.component.html',
  styleUrl: './profile-nav.component.scss'
})
export class ProfileNavComponent implements OnInit, AfterContentChecked, OnDestroy {

  isMaster: boolean = false;
  isOpened: boolean = false;
  isOpenConfirmModal: boolean = false;
  activeMenuItem: string | undefined = '';
  notificationsCountSubscription: Subscription | null = null;
  notificationsCount: number | null = null;

  constructor(private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private feedbackService: FeedbackService,
              private elRef: ElementRef,
              private cdr: ChangeDetectorRef,) {
    this.isMaster = this.userService.isMaster;
  }

  ngOnInit() {
    this.notificationsCountSubscription = this.feedbackService.notificationsCount$.subscribe((count: number) => {
      this.notificationsCount = count;
      this.cdr.detectChanges();
    })
  }

  ngAfterContentChecked(): void {
    this.activeMenuItem = document.querySelector('.profile-nav__link._active')?.innerHTML

  }

  logout(): void {
    this.authService.logout();
    this.userService.removeUserInfo();
    this.router.navigate(['/']).then();
    this._snackBar.open('Вы вышли из системы')
  }

  toggleExitModal(val: boolean) {
    this.isOpenConfirmModal = val;
    WindowsUtils.fixBody(val);
  }

  // ✅ Отслеживаем клики вне компонента
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpened) {
      this.toggleNav(); // или this.isOpened = false;
    }
  }

  toggleNav(): void {
    this.isOpened = !this.isOpened;
  }

  ngOnDestroy(): void {
    this.notificationsCountSubscription?.unsubscribe();
  }
}
