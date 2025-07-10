import {Component, OnDestroy, OnInit} from '@angular/core';
import {NoteCardComponent} from '../../../shared/components/cards/note-card/note-card.component';
import {BookingResponseType} from '../../../../types/booking-response.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventService} from '../../../shared/services/event.service';
import {Subscription} from 'rxjs';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-bookings',
  imports: [
    NoteCardComponent,
    RouterLink,
    RouterLinkActive,
    NgForOf
  ],
  standalone: true,
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent implements OnInit, OnDestroy {

  bookings: BookingResponseType[] = []
  getBookingsSubscription: Subscription | null = null;

  constructor(private _snackBar: MatSnackBar,
              private eventService: EventService,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit() {
    const period = this.activatedRoute.snapshot.url.length > 1 && this.activatedRoute.snapshot.url[1].path === 'past' ? 'past' : 'upcoming';
    this.getBookingsSubscription = this.eventService.getBookedEventsByUser(period)
      .subscribe({
        next: (data: BookingResponseType[] | DefaultResponseType) => {
          if (data && (data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.bookings = data as BookingResponseType[];
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка получения данных')
          }
        }
      })
  }

  ngOnDestroy() {
    this.getBookingsSubscription?.unsubscribe();
  }
}
