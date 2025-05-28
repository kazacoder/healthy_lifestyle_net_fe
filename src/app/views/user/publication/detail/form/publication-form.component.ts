import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {CategoryType} from '../../../../../../types/category.type';
import {UserService} from '../../../../../shared/services/user.service';
import {PublicationService} from '../../../../../shared/services/publication.service';
import {DefaultResponseType} from '../../../../../../types/default-response.type';
import {Settings} from '../../../../../../settings/settings';
import {publicationFormFieldsMatch, PublicationType} from '../../../../../../types/publication.type';
import {Router} from '@angular/router';

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
export class PublicationFormComponent implements OnInit, OnDestroy, OnChanges {
  isMaster: boolean = false;
  categories: CategoryType[] = [];
  categoriesUnfiltered: CategoryType[] = [];
  getCategoriesSubscription: Subscription | null = null;
  createPublication: Subscription | null = null;
  maxCatCount = Settings.maxCategoryCount;
  edit: boolean = false;

  @Input() imageForm: FormGroup | null = null;
  @Input() currentPublication: PublicationType | null = null;

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
      timePeriod: ['1', Validators.required],
    }),

    suit: [null, Validators.required],
    format: [null, Validators.required],
    date: ['', Validators.required],
    whatsapp: [null, Validators.required],
    telegram: [null, Validators.required],
    description: [null, Validators.required],
    categories: [[]]
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
    {value: '1', title: 'часы'},
    {value: '2', title: 'дни'},
  ]

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private publicationService: PublicationService,
              private router: Router) {
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
        this.categoriesUnfiltered = data as CategoryType[];
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

  ngOnChanges() {
    if (this.currentPublication) {
      this.edit = true;
      Object.entries(publicationFormFieldsMatch).forEach(([key, beKey]) => {
        if (this.currentPublication) {
          let value = this.currentPublication[beKey.field as keyof PublicationType]
          if (key === 'pricing') {
            value = value ? '_free' : '_from'
          }
          if (!beKey.group && key !== 'categories') {
            this.publicationForm.get(key).setValue(value?.toString());
          } else if (beKey.group) {
            const group = this.publicationForm.get(beKey.group)
            group.get(key).setValue(value?.toString())
          } else if (key === 'categories') {
            this.publicationForm.get(key).setValue(value);
            this.categories = [...this.categoriesUnfiltered.filter(
              (item: CategoryType) => (value as CategoryType[]).every((ex: CategoryType) => ex.id !== item.id)
            )]
          }
        }
      })
    }
  }

  addCategory(category: CategoryType) {
    const categoriesList = this.publicationForm.get('categories').value
    if (!categoriesList.find((x: CategoryType) => x.id === category.id)
      && categoriesList.length < Settings.maxCategoryCount) {
      this.publicationForm.get('categories').value.push(category)
      this.categories = [...this.categories.filter((x: CategoryType) => x.id !== category.id)]
    } else {
      this._snackBar.open('Максимальное количество категорий добавлено')
    }
  }

  removeCategory(id: number) {
    const categoriesList = this.publicationForm.get('categories').value.filter((x: CategoryType) => x.id !== id)
    this.publicationForm.get('categories').setValue(categoriesList)
    this.categories = [...this.categoriesUnfiltered.filter(
      (item: CategoryType) => !categoriesList.some((ex: CategoryType) => ex.id === item.id)
    )]
  }

  setPricing(value: '_from' | '_free') {
    this.publicationForm.get('pricing').setValue(value);
  }

  proceed() {
    console.log(this.publicationForm.valid)
    if (this.publicationForm.valid && (!this.imageForm || this.imageForm?.valid)) {
      const isFree = this.publicationForm.value.isFree === '_free' ? 'true' : 'false'

      const formData = new FormData();
      formData.append('title', this.publicationForm.value.title);
      formData.append('phone', this.publicationForm.value.phone);
      formData.append('ticket_amount', this.publicationForm.value.ticketAmount);
      formData.append('is_free', isFree);
      formData.append('price', this.publicationForm.value.price);
      formData.append('prepayment', this.publicationForm.value.prepayment);
      formData.append('city', this.publicationForm.value.address.city);
      formData.append('street', this.publicationForm.value.address.street);
      formData.append('house', this.publicationForm.value.address.house);
      formData.append('floor', this.publicationForm.value.address.floor);
      formData.append('office', this.publicationForm.value.address.office);
      formData.append('duration', this.publicationForm.value.duration.amount);
      formData.append('time_period', this.publicationForm.value.duration.timePeriod);
      formData.append('suit', this.publicationForm.value.suit);
      formData.append('format', this.publicationForm.value.format);
      formData.append('date', this.publicationForm.value.date);
      formData.append('whatsapp', this.publicationForm.value.whatsapp);
      formData.append('telegram', this.publicationForm.value.telegram);
      formData.append('description', this.publicationForm.value.description);

      if (this.publicationForm.value.categories.length > 0) {
        this.publicationForm.value.categories.forEach((category: CategoryType) => {
          formData.append('categories', category.id.toString());
        })
      }
      if (this.imageForm) {
        if (this.imageForm.value.mainImage) {
          formData.append('image', this.imageForm.value.mainImage);
        }
        if (this.imageForm.value.additionalImages.length > 0) {
          this.imageForm.value.additionalImages.forEach((item: { image: File }) => {
            formData.append('additional_images', item.image);
          })
        }
      }
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      this.createPublication = this.publicationService.createPublication(formData).subscribe({
        next: (data: PublicationType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.router.navigate(['/profile/publication']).then();
          this._snackBar.open('Событие успешно создано');
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка создания события')
          }
        }
      })
    }
  }

  save() {
    console.log('save')
  }

  ngOnDestroy() {
    this.getCategoriesSubscription?.unsubscribe()
    this.createPublication?.unsubscribe()
  }

}
