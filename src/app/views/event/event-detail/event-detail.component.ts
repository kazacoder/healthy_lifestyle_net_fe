import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {EventItemComponent} from './event-item/event-item.component';
import {EventDescComponent} from './event-desc/event-desc.component';
import {EventQuestionsComponent} from './event-questions/event-questions.component';
import {EventAddressComponent} from './event-address/event-address.component';
import {EventType} from '../../../../types/event.type';
import {Subscription} from 'rxjs';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {EventService} from '../../../shared/services/event.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';
import {EventResponseType} from '../../../../types/event-response.type';
import {CommonUtils} from '../../../shared/utils/common-utils';
import {
  EventCollectionHistoryComponent
} from './event-collections/event-collection-history/event-collection-history.component';
import {EventCard3Component} from '../../../shared/components/cards/event-card3/event-card3.component';
import {NgForOf, NgIf} from '@angular/common';
import {SwiperNavComponent} from '../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {SwiperContainer} from 'swiper/element';

@Component({
  selector: 'app-event-detail',
  imports: [
    EventItemComponent,
    EventDescComponent,
    EventQuestionsComponent,
    EventAddressComponent,
    EventCollectionHistoryComponent,
    EventCard3Component,
    NgForOf,
    SwiperNavComponent,
    NgIf
  ],
  standalone: true,
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: EventType | null = null;
  masterEvents: EventType[] = [];
  historyEvents: EventType[] = [];
  address: string = ''
  eventId: string | null | undefined = null;
  placesBooked: number = 0;
  getEventSubscription: Subscription | null = null;
  isLogged: boolean = false;
  isLoggedSubscription: Subscription | null = null;
  getBookedPlacesCountSubscription: Subscription | null = null;
  activatedRouterSubscription: Subscription | null = null;
  mastersEventSubscription: Subscription | null = null;
  recentEventSubscription: Subscription | null = null;
  masterHistorySwiper: HTMLElement | null = null;
  recentEventsSwiper: HTMLElement | null = null;

  eventSwiper: SwiperContainer | null = null;
  eventSwiperParams = {
    spaceBetween: 0,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: `.events-slider-master .swiper-button-next`,
      prevEl: `.events-slider-master .swiper-button-prev`,
    },
  }

  constructor(private activatedRoute: ActivatedRoute,
              private eventService: EventService,
              private _snackBar: MatSnackBar,
              private authService: AuthService,) {
  }

  ngOnInit() {
    this.masterHistorySwiper = document.querySelector('#masterEvents');
    this.recentEventsSwiper = document.querySelector('#recentEvents');
    this.activatedRouterSubscription = this.activatedRoute.params.subscribe(param => {
      this.eventId = param['url'];
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
      this.getEvent();
      this.getRecentEvents();
    });

    this.eventSwiper = document.querySelector('.event-swiper-master');
    if (this.eventSwiper) {
      Object.assign(this.eventSwiper, this.eventSwiperParams);
      this.eventSwiper.initialize();
    }

  }

  getEvent() {
    if (this.eventId) {
      this.getEventSubscription = this.eventService.getEvent(this.eventId).subscribe({
        next: (data: EventType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.event = data as EventType;
          this.getMastersEvents(this.event.author.toString());
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

  getMastersEvents(masterId: string) {
    this.mastersEventSubscription = this.eventService.getEventsList(100, 0,
      {ordering: ['date'], master: [masterId], date_from: [CommonUtils.formatDate(new Date())]}
    )
      .subscribe({
        next: (data: EventResponseType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.masterEvents = (data as EventResponseType).results.filter(item => item.id.toString() !== this!.eventId)
          if (this.masterHistorySwiper) {
            if (this.masterEvents.length < 1) {
              this.masterHistorySwiper.style.display = 'none';
            } else {
              this.masterHistorySwiper.style.display = 'block';
            }
          }
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

  getRecentEvents() {
    this.recentEventSubscription = this.eventService.getRecentEventList()
      .subscribe({
        next: (data: EventType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.historyEvents = (data as EventType[]).filter(item => item.id.toString() !== this!.eventId)
          if (this.recentEventsSwiper) {
            if (this.historyEvents.length < 1) {
              this.recentEventsSwiper.style.display = 'none';
            } else {
              this.recentEventsSwiper.style.display = 'block';
            }
          }
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
    this.getEventSubscription?.unsubscribe();
    this.activatedRouterSubscription?.unsubscribe();
    this.mastersEventSubscription?.unsubscribe();
    this.recentEventSubscription?.unsubscribe();
    this.isLoggedSubscription?.unsubscribe();
    this.getBookedPlacesCountSubscription?.unsubscribe();
  }
}
