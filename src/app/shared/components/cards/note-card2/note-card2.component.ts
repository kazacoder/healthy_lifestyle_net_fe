import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EventType} from '../../../../../types/event.type';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {CommonUtils} from '../../../utils/common-utils';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../services/favorite.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'note-card2',
  imports: [
    NgClass,
    RouterLink
  ],
  standalone: true,
  templateUrl: './note-card2.component.html',
  styleUrl: './note-card2.component.scss'
})
export class NoteCard2Component implements OnInit, OnDestroy {
  @Input() event: EventType | null = null;
  @Output() removeEventFromFavoriteIndicator: EventEmitter<boolean> = new EventEmitter();
  month: string = ''
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
            } else {
              this.event!.is_favorite = false;
              this.removeEventFromFavoriteIndicator.emit(true);
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
