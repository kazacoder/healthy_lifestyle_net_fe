import {Component, OnDestroy, OnInit} from '@angular/core';
import {NoteCard2Component} from '../../../../shared/components/cards/note-card2/note-card2.component';
import {RouterOutlet} from '@angular/router';
import {EventType} from '../../../../../types/event.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../../shared/services/favorite.service';
import {Subscription} from 'rxjs';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'favorite-events',
  imports: [
    NoteCard2Component,
    RouterOutlet,
    NgForOf
  ],
  standalone: true,
  templateUrl: './favorite-events.component.html',
  styleUrl: './favorite-events.component.scss'
})
export class FavoriteEventsComponent implements OnInit, OnDestroy {
  favoriteEvents: EventType[] = [];
  getFavoriteEventSubscription: Subscription | null = null;

  constructor(private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,) {
  }

  ngOnInit() {
    this.getFavoriteEventList();
  }

  getFavoriteEventList() {
    this.getFavoriteEventSubscription = this.favoriteService.getFavoriteEventsList().subscribe({
      next: (data: EventType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.favoriteEvents = data as EventType[];
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных')
        }
      }
    });
  }

  ngOnDestroy() {
    this.getFavoriteEventSubscription?.unsubscribe();
  }
}
