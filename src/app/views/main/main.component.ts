import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnDestroy, OnInit} from '@angular/core';
import {PosterInfoComponent} from '../../shared/components/events/poster-info/poster-info.component';
import {DateFeedComponent} from '../../shared/components/page-blocks/date-feed/date-feed.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {DateFilterComponent} from '../../shared/components/page-blocks/date-filter/date-filter.component';
import {EventCardComponent} from '../../shared/components/cards/event-card/event-card.component';
import {SwiperContainer} from 'swiper/element/bundle';
import {SwiperNavComponent} from '../../shared/components/ui/swiper-nav/swiper-nav.component';
import {EventCard2Component} from '../../shared/components/cards/event-card2/event-card2.component';
import {MasterCardComponent} from '../../shared/components/cards/master-card/master-card.component';
import {RouterLink} from '@angular/router';
import {CityModalComponent} from '../../shared/components/modals/city-modal/city-modal.component';
import {WindowsUtils} from '../../shared/utils/windows-utils';
import {ParamModalComponent} from '../../shared/components/modals/param-modal/param-modal.component';
import {MasterInfoType} from '../../../types/master-info.type';
import {Subscription} from 'rxjs';
import {MasterService} from '../../shared/services/master.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DefaultResponseType} from '../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {EventType} from '../../../types/event.type';
import {EventService} from '../../shared/services/event.service';
import {EventResponseType} from '../../../types/event-response.type';
import {AuthService} from '../../core/auth/auth.service';
import {CommonUtils} from '../../shared/utils/common-utils';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [PosterInfoComponent, DateFeedComponent, NgIf, DateFilterComponent, EventCardComponent, SwiperNavComponent,
    NgForOf, EventCard2Component, NgClass, MasterCardComponent, RouterLink, CityModalComponent, ParamModalComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class MainComponent implements AfterViewInit, OnInit, OnDestroy  {

  //ToDo add filter to nearestEvents,
  nearestEvents: EventType[] = [];
  topEventsList: EventType[] = [];
  mastersList: MasterInfoType[] = [];
  mastersListSubscription: Subscription | null = null;
  getEventsSubscription: Subscription | null = null;
  isLoggedSubscription: Subscription | null = null;
  isLogged:boolean = false;

  isCityModalOpened:boolean = false;
  isParamModalOpened:boolean = false;
  calendarActive: boolean = false;
  chosenCity: string = 'Все города';

  eventSwiper: SwiperContainer | null = null;
  eventSwiperParams = {
    spaceBetween: 0,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: `.events-slider .swiper-button-next`,
      prevEl: `.events-slider .swiper-button-prev`,
    },
  }

  event2Swiper: SwiperContainer | null = null;
  event2SwiperParams = {
    spaceBetween: 0,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: `.events-slider2 .swiper-button-next`,
      prevEl: `.events-slider2 .swiper-button-prev`,
    },
  }

  masterSwiper: SwiperContainer | null = null;
  masterSwiperParams = {
    spaceBetween: 0,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: `.master-slider .swiper-button-next`,
      prevEl: `.master-slider .swiper-button-prev`,
    },
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    (event.target as Window).innerWidth;
  }

  constructor(private eventService: EventService,
              private masterService: MasterService,
              private _snackBar: MatSnackBar,
              private authService: AuthService,) {
  }

  ngOnInit() {
    this.mastersListSubscription = this.masterService.getMastersList()
      .subscribe({
        next: (data: MasterInfoType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.mastersList = data as MasterInfoType[]
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка получения данных')
          }
        }
      });

    this.isLoggedSubscription = this.authService.isLogged$.subscribe((isLogged) => {
      this.isLogged = isLogged;
      this.getEventsSubscription = this.eventService.getEventsList().subscribe({
        next: (data: EventResponseType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.nearestEvents = (data as EventResponseType).results;
          this.topEventsList = CommonUtils.getRandomItems((data as EventResponseType).results, 7)
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка получения данных')
          }
        }
      });
    });
  }

  ngAfterViewInit() {
    this.eventSwiper = document.querySelector('.event-swiper');
    if (this.eventSwiper) {
      Object.assign(this.eventSwiper, this.eventSwiperParams);
      this.eventSwiper.initialize();
    }

    this.event2Swiper = document.querySelector('.nearest-events');
    if (this.event2Swiper) {
      Object.assign(this.event2Swiper, this.event2SwiperParams);
      this.event2Swiper.initialize();
    }

    this.masterSwiper = document.querySelector('.master-swiper');
    if (this.masterSwiper) {
      Object.assign(this.masterSwiper, this.masterSwiperParams);
      this.masterSwiper.initialize();
    }
  }

  toggleCalendarActive(value: boolean) {
    this.calendarActive = value;
  }

  toggleCityModal(value: boolean) {
    this.isCityModalOpened = value;
    WindowsUtils.fixBody(value)
  }

  toggleParamModal(value: boolean) {
    this.isParamModalOpened = value;
    WindowsUtils.fixBody(value)
  }

  chooseCity(value: string) {
    this.chosenCity = value;
  }

  updateTopEventsList (eventId: number, isFavorite: boolean) {
    const currentEventIdx = this.topEventsList.findIndex(item => item.id === eventId)
    if (currentEventIdx !== -1) {
      this.topEventsList[currentEventIdx] = {
        ...this.topEventsList[currentEventIdx],
        is_favorite: isFavorite
      };
    }
  }

  updateNearestEventsList (eventId: number, isFavorite: boolean) {
    const currentEventIdx = this.nearestEvents.findIndex(item => item.id === eventId)
    if (currentEventIdx !== -1) {
      this.nearestEvents[currentEventIdx] = {
        ...this.nearestEvents[currentEventIdx],
        is_favorite: isFavorite
      };
    }
  }

  ngOnDestroy() {
    this.mastersListSubscription?.unsubscribe();
    this.getEventsSubscription?.unsubscribe();
    this.isLoggedSubscription?.unsubscribe();
  }
}
