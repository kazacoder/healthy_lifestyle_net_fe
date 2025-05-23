import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {CategoryType} from '../../../../../../types/category.type';
import {UserService} from '../../../../../shared/services/user.service';
import {PublicationService} from '../../../../../shared/services/publication.service';
import {DefaultResponseType} from '../../../../../../types/default-response.type';

@Component({
  selector: 'publication-form',
  imports: [
    NgIf,
    NgSelectComponent,
    ReactiveFormsModule,
    NgForOf,
    NgClass
  ],
  standalone: true,
  templateUrl: './publication-form.component.html',
  styleUrl: './publication-form.component.scss'
})
export class PublicationFormComponent implements OnInit, OnDestroy {
  isMaster: boolean = false;
  categories: CategoryType[] = [];
  getCategoriesSubscription: Subscription | null = null;

  publicationForm: any = this.fb.group({
    title: ['', Validators.required],
    phone: ['', Validators.required],
    ticketAmount: [0, Validators.required],
    pricing: ['_free', Validators.required],
    price: [0],
    prepayment: [0],
    address: this.fb.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      house: ['', Validators.required],
      floor: ['', Validators.required],
      office: ['', Validators.required],
    }),
    duration: this.fb.group({
      amount: [null, Validators.required],
      timePeriod: ['hours', Validators.required],
    }),

    suit: [null, Validators.required],
    format: [null, Validators.required],
    date: ['', Validators.required],
    whatsapp: [null, Validators.required],
    telegram: [null, Validators.required],
    description: [null, Validators.required],
  })

  suitOpt = [
    {id: '1', title: 'Всем'},
    {id: '2', title: 'Только женщинам'},
    {id: '3', title: 'Только мужчинам'},
  ]

  formatOpt = [
    {id: '1', title: 'Онлайн'},
    {id: '2', title: 'Офлайн'},
    {id: '3', title: 'Комбинированный'},
  ]

  timePeriodOpt = [
    {value: 'hours', title: 'часы'},
    {value: 'days', title: 'дни'},
  ]

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private publicationService: PublicationService,) {
    this.isMaster = this.userService.isMaster;
  }

  ngOnInit() {
    this.getCategoriesSubscription = this.publicationService.getCategoriesList().subscribe({
      next: (data: CategoryType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.categories = data as CategoryType[];
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

  addCategory(id: number) {
    console.log(id)
  }

  setPricing(value: '_from' | '_free') {
    this.publicationForm.get('pricing').setValue(value);
  }

  proceed () {
    console.log(this.publicationForm.value)
  }

  ngOnDestroy() {
    this.getCategoriesSubscription?.unsubscribe()
  }
}
