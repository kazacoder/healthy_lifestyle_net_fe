import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateFilterComponent} from '../../../shared/components/page-blocks/date-filter/date-filter.component';
import {DateFeedComponent} from '../../../shared/components/page-blocks/date-feed/date-feed.component';
import {PosterInfoComponent} from '../../../shared/components/events/poster-info/poster-info.component';
import {WindowsUtils} from '../../../shared/utils/windows-utils';
import {CityModalComponent} from '../../../shared/components/modals/city-modal/city-modal.component';
import {ParamModalComponent} from '../../../shared/components/modals/param-modal/param-modal.component';
import {NgClass, NgForOf} from '@angular/common';
import {EventCard2Component} from '../../../shared/components/cards/event-card2/event-card2.component';
import {ParamFilterComponent} from '../../../shared/components/param-filter/param-filter.component';
import {SortComponent} from '../../../shared/components/ui/sort/sort.component';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventService} from '../../../shared/services/event.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {EventType} from '../../../../types/event.type';

@Component({
  selector: 'app-events-list',
  imports: [
    DateFilterComponent,
    DateFeedComponent,
    PosterInfoComponent,
    CityModalComponent,
    ParamModalComponent,
    NgClass,
    EventCard2Component,
    NgForOf,
    ParamFilterComponent,
    SortComponent
  ],
  standalone: true,
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.scss'
})
export class EventsListComponent implements OnInit, OnDestroy {
  chosenCity: string = 'Все города';
  isCityModalOpened: boolean = false;
  isParamModalOpened: boolean = false;
  calendarActive: boolean = false;
  events: EventType[] = [];
  getEventsSubscription: Subscription | null = null;

  constructor(private eventService: EventService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getEventsSubscription = this.eventService.getEventsList().subscribe({
      next: (data: EventType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.events = data as EventType[];
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

  ngOnDestroy() {
    this.getEventsSubscription?.unsubscribe()
  }

  protected readonly filterObjects = filterObjects;
}

// ToDo remove after the Backend is ready

const filterObjects: {title: string, options: string[], search: boolean, defaultOption?: string}[] = [
  {title: 'Формат', options: ['Формат 1', 'Формат 2'], search: false},
  {title: 'Категории', options: ['Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна'], search: true},
  {title: 'Тип мероприятия', options: ['Платное', 'Бесплатное'], search: false},
  {title: 'Для кого', options: ['Мужчинам', 'Женщинам'], search: false, defaultOption: 'Всем'},
  {title: 'Длительность', options: ['1 час', '2 часа'], search: false, defaultOption: 'Любая'},
  {title: 'Создатель мероприятия', options: ['Создатель 1', 'Создатель 2'], search: false},
]
