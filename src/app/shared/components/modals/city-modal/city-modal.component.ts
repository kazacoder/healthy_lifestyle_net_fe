import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {EventService} from '../../../services/event.service';
import {EventCityType, EventsCitesResponseType} from '../../../../../types/event-city.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'city-modal',
  imports: [
    NgClass,
    CloseBtnMobComponent,
    NgForOf,
    FormsModule
  ],
  standalone: true,
  templateUrl: './city-modal.component.html',
  styleUrl: './city-modal.component.scss'
})
export class CityModalComponent implements OnInit, OnDestroy {
  cities: EventCityType[] = [];
  citiesFiltered: EventCityType[] = [];
  searchField: string = ''

  @Input() isOpened: boolean = false;
  @Input() chosenCity: string | null = null;

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() onChoiceCity: EventEmitter<string> = new EventEmitter();

  activatedRouterSubscription: Subscription | null = null;
  getCitiesListSubscription: Subscription | null = null;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private eventService: EventService,
              private _snackBar: MatSnackBar,) {
  }

  ngOnInit() {
    this.onCloseModal.emit(this.isOpened);
    this.activatedRouterSubscription = this.activatedRoute.queryParams.subscribe(params => {
      const value = params['city'];
      this.chosenCity = value ? value : null;
      if (this.chosenCity) {
        this.onChoiceCity.emit(this.chosenCity);
      } else {
        this.onChoiceCity.emit('Все города');
      }
    })

    this.getCitiesListSubscription = this.eventService.getEventsCitiesList().subscribe({
      next: (data: EventsCitesResponseType | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.cities = (data as EventsCitesResponseType).cities;
        this.citiesFiltered = (data as EventsCitesResponseType).cities;
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

  closeModal() {
    this.onCloseModal.emit(false);
    this.isOpened = false;
  }

  filterCity() {
    console.log(this.searchField);
    console.log(this.cities);
    const query = this.searchField.trim().toLowerCase();
    if (query) {
      this.citiesFiltered = this.cities.filter(city => {
        console.log(city.city.includes(query))
        city.city.includes(query);
      })
    } else {
      this.citiesFiltered = [...this.cities];
    }
    console.log(this.citiesFiltered)
  }

  cityProceed(city: string) {
    this.onChoiceCity.emit(city);
    this.onCloseModal.emit(false);
    this.isOpened = false;


    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams, ['city']: city
    };

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge'
    }).then();

  }

  ngOnDestroy() {
    this.activatedRouterSubscription?.unsubscribe();
    this.getCitiesListSubscription?.unsubscribe();
  }
}
