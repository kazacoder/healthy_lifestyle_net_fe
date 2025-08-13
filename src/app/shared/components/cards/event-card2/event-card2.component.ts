import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {EventType} from '../../../../../types/event.type';
import {MonthToStringPipe} from '../../../pipes/month-to-string.pipe';
import {ToIntPipe} from '../../../pipes/to-int.pipe';
import {CommonUtils} from '../../../utils/common-utils';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../services/favorite.service';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'event-card2',
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    NgForOf,
    MonthToStringPipe,
    ToIntPipe
  ],
  standalone: true,
  templateUrl: './event-card2.component.html',
  styleUrl: './event-card2.component.scss',
})
export class EventCard2Component implements OnInit, OnDestroy {
  @Input() event: EventType | null = null;
  @Input() isLogged: boolean = false;
  @Output() onChangeFavorite: EventEmitter<{ eventId: number, isFavorite: boolean }> = new EventEmitter();
  periodLabel: string = '';
  month: string = ''
  tagsOpen: boolean = false;
  toggleFavoriteEventSubscription: Subscription | null = null;

  private wasInside = false;

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickOut() {
    if (!this.wasInside) {
      this.tagsOpen = false;
    }
    this.wasInside = false;
  }

  constructor(private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,) {
  }

  ngOnInit() {
    this.periodLabel = CommonUtils.getDurationLabel(this.event!.duration, this.event!.time_period)
    this.month = CommonUtils.getRussianMonthName(this.event!.date);
  }

  clickTagsButton() {
    this.tagsOpen = !this.tagsOpen;
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
              this.onChangeFavorite.emit({eventId: this.event.id, isFavorite: true});
            } else {
              this.event!.is_favorite = false;
              this.onChangeFavorite.emit({eventId: this.event!.id, isFavorite: false});
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

  ngOnDestroy() {
    this.toggleFavoriteEventSubscription?.unsubscribe();
  }
}
