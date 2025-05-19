import {Component, OnDestroy, OnInit} from '@angular/core';
import {MasterCardComponent} from '../../../shared/components/cards/master-card/master-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {PosterInfoComponent} from '../../../shared/components/events/poster-info/poster-info.component';
import {CityModalComponent} from '../../../shared/components/modals/city-modal/city-modal.component';
import {WindowsUtils} from '../../../shared/utils/windows-utils';
import {ParamFilterComponent} from '../../../shared/components/param-filter/param-filter.component';
import {SortComponent} from '../../../shared/components/ui/sort/sort.component';
import {MasterInfoType} from '../../../../types/master-info.type';
import {Subscription} from 'rxjs';
import {MasterService} from '../../../shared/services/master.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-masters-list',
  imports: [
    MasterCardComponent,
    NgForOf,
    PosterInfoComponent,
    CityModalComponent,
    NgIf,
    ParamFilterComponent,
    SortComponent
  ],
  standalone: true,
  templateUrl: './masters-list.component.html',
  styleUrl: './masters-list.component.scss'
})
export class MastersListComponent implements OnInit, OnDestroy {
  isCityModalOpened: boolean = false;
  chosenCity: string = 'Все города';
  mastersList: MasterInfoType[] = [];
  mastersListSubscription: Subscription | null = null;

  protected readonly filterObjects = filterObjects;

  constructor(private masterService: MasterService,
              private _snackBar: MatSnackBar) {
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
          console.log(this.mastersList)
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

  toggleCityModal(value: boolean) {
    this.isCityModalOpened = value;
    WindowsUtils.fixBody(value)
  }

  chooseCity(value: string) {
    this.chosenCity = value;
  }

  ngOnDestroy() {
    this.mastersListSubscription?.unsubscribe();
  }
}

// ToDo remove after the Backend is ready

const filterObjects: {title: string, options: string[], search: boolean, defaultOption?: string}[] = [
  {title: 'Формат занятий', options: ['Формат 1', 'Формат 2'], search: false},
  {title: 'Стаж', options: ['1 год', '2 года'], search: false, defaultOption: 'Любой'},
  {title: 'Вид деятельности', options: ['Деятельность', 'Деятельность', 'Деятельность', 'Деятельность', 'Деятельность',
      'Деятельность', 'Деятельность', 'Деятельность', 'Деятельность', 'Деятельность', 'Деятельность', 'Деятельность'],
    search: true},
]
