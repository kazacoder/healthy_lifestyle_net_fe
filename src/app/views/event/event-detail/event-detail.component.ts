import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventItemComponent} from './event-item/event-item.component';
import {EventDescComponent} from './event-desc/event-desc.component';
import {EventQuestionsComponent} from './event-questions/event-questions.component';
import {EventAddressComponent} from './event-address/event-address.component';
import {EventCollectionsComponent} from './event-collections/event-collections.component';
import {EventType} from '../../../../types/event.type';
import {Subscription} from 'rxjs';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {EventService} from '../../../shared/services/event.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';

@Component({
  selector: 'app-event-detail',
  imports: [
    EventItemComponent,
    EventDescComponent,
    EventQuestionsComponent,
    EventAddressComponent,
    EventCollectionsComponent
  ],
  standalone: true,
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: EventType | null = null;
  address: string = ''
  eventId: string | null | undefined = null;
  placesBooked: number = 0;
  getEventSubscription: Subscription | null = null;
  isLogged: boolean = false;
  isLoggedSubscription: Subscription | null = null;
  getBookedPlacesCountSubscription: Subscription | null = null;

  constructor(private activatedRoute: ActivatedRoute,
              private eventService: EventService,
              private _snackBar: MatSnackBar,
              private authService: AuthService,) {
  }

  ngOnInit() {
    this.eventId = this.activatedRoute.snapshot.paramMap.get('url');
    this.isLoggedSubscription = this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.isLogged = isLogged;
      if (this.eventId && isLogged) {
        this.getBookedPlacesCountSubscription = this.eventService.getBookedEventPlacesByUser(this.eventId)
          .subscribe({
            next: (data: { places: number } | DefaultResponseType) => {
              if ((data as DefaultResponseType).detail !== undefined) {
                const error = (data as DefaultResponseType).detail;
                this._snackBar.open(error);
                throw new Error(error);
              }
              this.placesBooked = (data as { places: number }).places;
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
    });
    if (this.eventId) {
      this.getEventSubscription = this.eventService.getEvent(this.eventId).subscribe({
        next: (data: EventType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.event = data as EventType;
          this.address = this.event.city ? `г. ${this.event.city}` : '';
          this.address += this.event.street ? `, ул. ${this.event.street}` : '';
          this.address += this.event.house ? `, д. ${this.event.house}` : '';
          this.address += this.event.floor ? `, эт. ${this.event.floor}` : '';
          this.address += this.event.office ? `, к. ${this.event.office}` : '';
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
  }

  ngOnDestroy() {
    this.getEventSubscription?.unsubscribe();
    this.isLoggedSubscription?.unsubscribe();
    this.getBookedPlacesCountSubscription?.unsubscribe();
  }
}
