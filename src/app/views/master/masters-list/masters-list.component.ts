import {Component, OnDestroy, OnInit} from '@angular/core';
import {MasterCardComponent} from '../../../shared/components/cards/master-card/master-card.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
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
import {ActivatedRoute} from '@angular/router';
import {SpecialityType} from '../../../../types/speciality.type';
import {SpecialityService} from '../../../shared/services/speciality.service';
import {FilterObjectType} from '../../../../types/filter-object.type';
import {AuthService} from '../../../core/auth/auth.service';
import {ParamsObjectType} from '../../../../types/params-object.type';
import {Settings} from '../../../../settings/settings';
import {MasterResponseType} from '../../../../types/master-response.type';

@Component({
  selector: 'app-masters-list',
  imports: [
    MasterCardComponent,
    NgForOf,
    PosterInfoComponent,
    CityModalComponent,
    NgIf,
    ParamFilterComponent,
    SortComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './masters-list.component.html',
  styleUrl: './masters-list.component.scss'
})
export class MastersListComponent implements OnInit, OnDestroy {
  isCityModalOpened: boolean = false;
  offset: number = 0;
  params: ParamsObjectType | null = null;
  chosenCity: string = 'Все города';
  mastersList: MasterInfoType[] = [];
  mastersListSubscription: Subscription | null = null;
  activatedRouterSubscription: Subscription | null = null;
  getSpecialityListSubscription: Subscription | null = null;
  filtersSelected: boolean = false;
  showMoreButton: boolean = false;
  isLoggedSubscription: Subscription | null = null;
  isLogged: boolean = false;

  filterObjects: FilterObjectType[] = [];

  constructor(private masterService: MasterService,
              private _snackBar: MatSnackBar,
              private specialityService: SpecialityService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,) {
  }

  ngOnInit() {

    //ToDo Формат занятий - уточнить и обновить код, поправить фильтры - получать с БЭ
    this.getSpecialityListSubscription = this.specialityService.getSpecialityList().subscribe({
      next: (data: SpecialityType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        const receivedSpecialityList = data as SpecialityType[]

        this.filterObjects = [
          {
            title: 'Формат занятий',
            name: 'formats',
            options: [{id: 1, title: 'Формат 1'}, {id: 2, title: 'Формат 2'}],
            search: false
          },
          {
            title: 'Стаж',
            name: 'experience',
            options: [{id: 1, title: '1 год'}, {id: 2, title: '2 года'}],
            search: false,
            defaultOption: 'Любой'
          },
          {
            title: 'Вид деятельности',
            name: 'specialities',
            options: receivedSpecialityList,
            search: true,
            multi: true
          },
          {
            title: 'Пол',
            name: 'gender',
            options: [{id: 'male', title: 'Мужчина'}, {id: 'female', title: 'Женщина'}],
            search: false,
            defaultOption: 'Любой'
          },
        ]
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных')
        }
      }
    })

    this.isLoggedSubscription = this.authService.isLogged$.subscribe((isLogged) => {
      this.isLogged = isLogged;
      this.activatedRouterSubscription = this.activatedRoute.queryParams.subscribe(params => {
        this.filtersSelected = Object.keys(params).length > 1 || (Object.keys(params).length === 1 && Object.keys(params)[0] !== 'ordering');
        this.params = params;
        this.getMastersResponse();
      });
    });
  }

  getMastersResponse(offset: number = 0) {
    this.mastersListSubscription = this.masterService.getMastersList(Settings.masterDefaultLimit, offset, this.params)
      .subscribe({
        next: (data: MasterResponseType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }

          const masterResponse = data as MasterResponseType

          if (offset > 0 && masterResponse) {
            this.mastersList = Array.prototype.concat(this.mastersList, masterResponse.results);
          } else {
            this.mastersList = masterResponse.results;
          }

          this.showMoreButton = masterResponse.count > this.mastersList.length;
          this.offset = this.mastersList.length;


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

  toggleCityModal(value: boolean) {
    this.isCityModalOpened = value;
    WindowsUtils.fixBody(value)
  }

  chooseCity(value: string) {
    this.chosenCity = value;
  }

  ngOnDestroy() {
    this.mastersListSubscription?.unsubscribe();
    this.activatedRouterSubscription?.unsubscribe();
    this.getSpecialityListSubscription?.unsubscribe();
  }
}
