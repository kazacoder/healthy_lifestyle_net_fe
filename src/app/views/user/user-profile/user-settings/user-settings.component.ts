import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {NotificationMatch, NotificationsType} from '../../../../../types/notifications.type';
import {filter, map, pairwise, Subscription} from 'rxjs';
import {UserService} from '../../../../shared/services/user.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserFullInfoType} from '../../../../../types/user-full-info.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';

@Component({
  selector: 'user-settings',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  notifications: NotificationsType | null = null;
  @Input()
  userId: string | null = null;
  @Input()
  isMaster: boolean = false;


  notificationsForm = this.fb.group({
    receiveNotificationsSite: [false],
    receiveNotificationsEmail: [false],
    receiveNotificationsEvents: [false],
    receiveNotificationsNews: [false],
    receiveNotificationsBooks: [false],
    receiveNotificationsQuestions: [false],
  })

  formChangeSubscription: Subscription | null = null;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    if (this.notifications) {
      this.notificationsForm.setValue(this.notifications);
    }
  }

  ngOnChanges() {
    this.formChangeSubscription = this.notificationsForm.valueChanges.pipe(
      pairwise(),
      map(([oldState, newState]: [{ [key: string]: boolean | null }, { [key: string]: boolean | null }]) => {
        let changes: { [key: string]: boolean | null } = {};
        for (const key in newState) {
          if (oldState[key] !== newState[key] &&
            oldState[key] !== undefined) {
            changes[key] = newState[key];
          }
        }
        return changes;
      }),
      filter(changes => Object.keys(changes).length !== 0 && !this.notificationsForm.invalid)
    ).subscribe(val => {
      const key = Object.keys(val)[0]
      const newKey = NotificationMatch[key]
      const newValue: {[key: string]: boolean | null} = {}
      newValue[newKey] = val[key];
      if (this.userId) {
        this.userService.updateProfileInfo(this.userId, newValue).subscribe({
          next: (data: UserFullInfoType | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
            } else {
              this._snackBar.open('Ошибка обновления данных')
            }
          }
        })
      }
    })
  }

  ngOnDestroy() {
    this.formChangeSubscription?.unsubscribe()
  }
}
