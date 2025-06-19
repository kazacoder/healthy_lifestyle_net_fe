import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateFilterComponent} from '../../../shared/components/page-blocks/date-filter/date-filter.component';
import {DateFeedComponent} from '../../../shared/components/page-blocks/date-feed/date-feed.component';
import {PosterInfoComponent} from '../../../shared/components/events/poster-info/poster-info.component';
import {WindowsUtils} from '../../../shared/utils/windows-utils';
import {CityModalComponent} from '../../../shared/components/modals/city-modal/city-modal.component';
import {ParamModalComponent} from '../../../shared/components/modals/param-modal/param-modal.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {EventCard2Component} from '../../../shared/components/cards/event-card2/event-card2.component';
import {ParamFilterComponent} from '../../../shared/components/param-filter/param-filter.component';
import {SortComponent} from '../../../shared/components/ui/sort/sort.component';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventService} from '../../../shared/services/event.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {EventType} from '../../../../types/event.type';
import {EventResponseType} from '../../../../types/event-response.type';
import {Settings} from '../../../../settings/settings';
import {FiltersDataType} from '../../../../types/filters-data.type';

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
    SortComponent,
    NgIf
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
  offset: number = 0;
  showMoreButton: boolean = false;
  getEventsSubscription: Subscription | null = null;
  getFiltersSubscription: Subscription | null = null;
  protected readonly filterObjects: {title: string, options: string[], search: boolean, defaultOption?: string}[] = [];


  constructor(private eventService: EventService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getFiltersResponse();
    this.getEventsResponse();
  }

  getEventsResponse(offset: number = 0) {
    this.getEventsSubscription = this.eventService.getEventsList(Settings.eventDefaultLimit, offset).subscribe({
      next: (data: EventResponseType | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        const eventResponse = data as EventResponseType

        if (offset > 0 && eventResponse) {
          this.events = Array.prototype.concat(this.events, eventResponse.results);
        } else {
          this.events = eventResponse.results;
        }

        this.showMoreButton = eventResponse.count > this.events.length;
        this.offset = this.events.length;
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


  getFiltersResponse() {
    this.getFiltersSubscription = this.eventService.getFiltersData().subscribe({
      next: (data: FiltersDataType | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        console.log(data)
        const filters = data as FiltersDataType
        this.filterObjects.push({title: 'Формат', options: filters.formats.map(item => item.title), search: false});
        this.filterObjects.push({title: 'Категории', options: filters.categories.map(item => item.title), search: true});
        this.filterObjects.push({title: 'Тип мероприятия', options: ['Платное', 'Бесплатное'], search: false});
        this.filterObjects.push({title: 'Для кого', options: filters.suits.map(item => item.title), search: false, defaultOption: 'Всем'});
        this.filterObjects.push({title: 'Длительность', options: ['1 час', '2 часа'], search: false, defaultOption: 'Любая'});
        this.filterObjects.push({title: 'Создатель мероприятия', options: filters.masters.map(item => item.full_name), search: true});
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных фильтов')
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
    this.getEventsSubscription?.unsubscribe();
    this.getFiltersSubscription?.unsubscribe();
  }
}

