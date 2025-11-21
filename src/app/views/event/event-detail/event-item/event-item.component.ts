import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {EventType} from '../../../../../types/event.type';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {RouterLink} from '@angular/router';
import {CommonUtils} from '../../../../shared/utils/common-utils';
import {ToIntPipe} from '../../../../shared/pipes/to-int.pipe';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../../shared/services/favorite.service';
import {AuthService} from '../../../../core/auth/auth.service';
import {ShareModalComponent} from '../../../../shared/components/modals/share-modal/share-modal.component';
import {WindowsUtils} from '../../../../shared/utils/windows-utils';

@Component({
  selector: 'event-item',
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    NgStyle,
    ToIntPipe,
    NgClass,
    ShareModalComponent
  ],
  standalone: true,
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.scss'

})
export class EventItemComponent implements OnInit, OnChanges, OnDestroy {
  periodLabel: string = '';
  @Input() event: EventType | null = null;
  month: string= ''
  @Input() address: string | null = '';
  @Output() updateEvent: EventEmitter<boolean> = new EventEmitter();
  toggleFavoriteEventSubscription: Subscription | null = null;
  isLoggedInSubscription: Subscription | null = null;
  isLoggedIn: boolean = false;
  isShareModalOpen: boolean = false;

  constructor(private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,
              private authService: AuthService,) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.isLoggedInSubscription = this.authService.isLogged$.subscribe(isLoggedIn => {
      if (!this.isLoggedIn && isLoggedIn) {
        this.updateEvent.emit(true);
      }
      this.isLoggedIn = isLoggedIn;
    })
  }

  ngOnChanges() {
    if (this.event?.duration && this.event?.time_period) {
      this.periodLabel = CommonUtils.getDurationLabel(this.event!.duration, this.event!.time_period)
    }
    if (this.event?.date) {
      this.month = CommonUtils.getRussianMonthName(this.event.date);
    }
  }

  toggleFavorite() {
    if (this.event) {
      this.toggleFavoriteEventSubscription = this.favoriteService.toggleFavoriteEvent(this.event.is_favorite, this.event.id)
        .subscribe({
          next: (data: EventType | null | DefaultResponseType) => {
            if (data) {
              if ((data as DefaultResponseType).detail !== undefined) {
                const error = (data as DefaultResponseType).detail;
                this._snackBar.open(error);
                throw new Error(error);
              }
              this.event = data as EventType;
            } else {
              this.event!.is_favorite = false;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
            } else {
              this._snackBar.open('Ошибка обработки избранного')
            }
          }
        })
    }
  }

  toggleShareModal(val: boolean) {
    this.isShareModalOpen = val;
    WindowsUtils.fixBody(val);
  }

  ngOnDestroy() {
    this.toggleFavoriteEventSubscription?.unsubscribe();
    this.isLoggedInSubscription?.unsubscribe();
  }

  protected readonly window = window;
}
