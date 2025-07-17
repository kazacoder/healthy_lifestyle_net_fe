import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {EventType} from '../../../../../types/event.type';
import {NgClass, NgForOf} from '@angular/common';
import {CommonUtils} from '../../../utils/common-utils';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../services/favorite.service';

@Component({
  selector: 'event-card',
  imports: [
    RouterLink,
    NgForOf,
    NgClass
  ],
  standalone: true,
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})


export class EventCardComponent implements OnInit, OnDestroy {
  @Input() event: EventType | null = null;
  @Output() onChangeFavorite: EventEmitter<{ eventId: number, isFavorite: boolean }> = new EventEmitter();
  month: string = '';
  toggleFavoriteEventSubscription: Subscription | null = null;

  constructor(private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,) {
  }

  ngOnInit() {
    this.month = CommonUtils.getRussianMonthName(this.event!.date);
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
