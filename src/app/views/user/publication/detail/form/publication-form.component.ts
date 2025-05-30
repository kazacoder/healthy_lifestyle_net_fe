import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {combineLatest, Subscription} from 'rxjs';
import {CategoryType} from '../../../../../../types/category.type';
import {UserService} from '../../../../../shared/services/user.service';
import {PublicationService} from '../../../../../shared/services/publication.service';
import {DefaultResponseType} from '../../../../../../types/default-response.type';
import {Settings} from '../../../../../../settings/settings';
import {PubFormKey, publicationFormFieldsMatch, PublicationType} from '../../../../../../types/publication.type';
import {Router} from '@angular/router';
import {SuitType} from '../../../../../../types/suit.type';
import {FormatType} from '../../../../../../types/format.type';
import {TimePeriodType} from '../../../../../../types/time-period.type';
import {MatFormField, MatHint, MatInput, MatSuffix} from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {CommonUtils, highlightWeekend} from '../../../../../shared/utils/common-utils';

@Component({
  selector: 'publication-form',
  imports: [
    NgIf,
    NgSelectComponent,
    ReactiveFormsModule,
    NgForOf,
    NgClass,
    MatInput,
    MatDatepickerInput,
    MatDatepicker,
    MatDatepickerToggle,
    MatSuffix,
    MatHint,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormField
  ],
  providers: [
    MatDatepickerModule,
  ],
  standalone: true,
  templateUrl: './publication-form.component.html',
  styleUrl: './publication-form.component.scss'
})
export class PublicationFormComponent implements OnInit, OnDestroy, OnChanges {
  isMaster: boolean = false;
  categories: CategoryType[] = [];
  suit: SuitType[] = [];
  format: FormatType[] = [];
  timePeriod: TimePeriodType[] = [];
  categoriesUnfiltered: CategoryType[] = [];
  getCategoriesSubscription: Subscription | null = null;
  getSuitsSubscription: Subscription | null = null;
  getFormatsSubscription: Subscription | null = null;
  getTimePeriodsSubscription: Subscription | null = null;
  updatePublicationSubscription: Subscription | null = null;
  createPublication: Subscription | null = null;
  maxCatCount = Settings.maxCategoryCount;
  edit: boolean = false;
  dp: any = null;
  areFormsValid: boolean = false

  @Input() existingFilesIds: number[] = [];
  @Input() imageForm: FormGroup | null = null;
  @Input() imagesChanged: { main: boolean, additional: boolean } = {main: false, additional: false};
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

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private publicationService: PublicationService,
              private router: Router) {
    this.isMaster = this.userService.isMaster;
  }

  ngOnInit() {
    this.userService.isMasterObservable.subscribe(isMaster => {
      this.isMaster = isMaster;
    })
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
    });

    this.getSuitsSubscription = this.publicationService.getSuitsList().subscribe({
      next: (data: SuitType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        const suitArray = data as SuitType[];
        this.suit = suitArray.map(item => ({
          ...item,
          id: item.id.toString()
        }));
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных')
        }
      }
    });

    this.getFormatsSubscription = this.publicationService.getFormatList().subscribe({
      next: (data: FormatType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        const suitArray = data as FormatType[];
        this.format = suitArray.map(item => ({
          ...item,
          id: item.id.toString()
        }));
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных')
        }
      }
    });

    this.getTimePeriodsSubscription = this.publicationService.getTimePeriodList().subscribe({
      next: (data: TimePeriodType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        const suitArray = data as TimePeriodType[];
        this.timePeriod = suitArray.map(item => ({
          ...item,
          id: item.id.toString()
        }));
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных')
        }
      }
    });
    this.subscribeToForms();
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
    this.subscribeToForms();
  }

  buildPublicationFormData(): FormData {
    const formData = new FormData();
    const form = this.publicationForm as FormGroup;

    // Проходим по корневым контролам
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key)!;
      // Если это вложенный FormGroup (address, duration)
      if (key !== 'categories' && key !== 'pricing' && key !== 'date') {
        if (control instanceof FormGroup) {
          const group = control as FormGroup;
          Object.keys(group.controls).forEach(subKey => {
            const subControl = group.get(subKey)!;
            if (subControl.dirty) {
              formData.append(publicationFormFieldsMatch[subKey as PubFormKey].field, subControl.value);
            }
          });
        }
        // Простые контролы
        else if (control.dirty) {
          formData.append(publicationFormFieldsMatch[key as PubFormKey].field, control.value);
        }
      } else if (key === 'pricing' && control.dirty) {
        const value = control.value === '_free';
        formData.append(publicationFormFieldsMatch[key as PubFormKey].field, value.toString());
      } else if (key === 'date' && control.dirty) {
        formData.append('date', CommonUtils.formatDate(control.value));
      } else if (key === 'categories' && control.dirty) {
        if (control.value.length > 0) {
          control.value.forEach((category: CategoryType) => {
            formData.append('categories', category.id.toString());
          })
        } else {
          formData.append('categories', 'null');
        }
      }
    });

    return formData;
  }

  buildImagesFormData(formData: FormData): void {
    if (this.imageForm) {
      if (this.imagesChanged.main) {
        formData.append('image', this.imageForm.value.mainImage);
      }
      if (this.imagesChanged.additional) {
        formData.append('existing_images', JSON.stringify(this.existingFilesIds));
        if (this.imageForm.value.additionalImages.length > 0) {
          this.imageForm.value.additionalImages.forEach((item: { image: File }) => {
            formData.append('additional_images', item.image);
          })
        }
      }
    }
  }

  addCategory(category: CategoryType) {
    const ctrl = this.publicationForm.get('categories')!;
    const categoriesList = ctrl.value
    if (!categoriesList.find((x: CategoryType) => x.id === category.id)
      && categoriesList.length < Settings.maxCategoryCount) {
      ctrl.value.push(category);
      ctrl.markAsDirty();              // помечаем контрол как dirty
      ctrl.updateValueAndValidity();   // пересчитываем валидацию
      this.categories = [...this.categories.filter((x: CategoryType) => x.id !== category.id)]
    } else {
      this._snackBar.open('Максимальное количество категорий добавлено')
    }
  }

  removeCategory(id: number) {
    const ctrl = this.publicationForm.get('categories')!;
    const categoriesList = ctrl.value.filter((x: CategoryType) => x.id !== id)
    ctrl.setValue(categoriesList)
    ctrl.markAsDirty();
    ctrl.updateValueAndValidity();
    this.categories = [...this.categoriesUnfiltered.filter(
      (item: CategoryType) => !categoriesList.some((ex: CategoryType) => ex.id === item.id)
    )]
  }

  setPricing(value: '_from' | '_free') {
    this.publicationForm.get('pricing').setValue(value);
  }

  proceed() {
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
      formData.append('date', CommonUtils.formatDate(this.publicationForm.value.date));
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
      });
    }
  }

  save() {
    const formData = this.buildPublicationFormData();
    this.buildImagesFormData(formData);

    const hasChanged = Array.from(formData.keys()).length > 0

    if (hasChanged && this.publicationForm.valid &&
      (!this.imageForm || this.imageForm?.valid)) {
      this.updatePublicationSubscription = this.publicationService.updatePublication(this.currentPublication!.id, formData)
        .subscribe({
          next: (data: PublicationType | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            this.router.navigate(['/profile/publication']).then();
            this._snackBar.open('Событие успешно обновлено');
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
            } else {
              this._snackBar.open('Ошибка обновления события')
            }
          }
        });
    } else if (!hasChanged) {
      this.router.navigate(['/profile/publication']).then();
      this._snackBar.open('Нет изменений');
    }
  }

  preventInput(event: KeyboardEvent): void {
    event.preventDefault();
  }

  private subscribeToForms(): void {
    if (!this.publicationForm) return;

    const formsToWatch = [this.publicationForm.statusChanges];

    if (this.imageForm) {
      formsToWatch.push(this.imageForm.statusChanges);
    }

    combineLatest(formsToWatch).subscribe(() => {
      this.areFormsValid = this.publicationForm.valid && (this.imageForm?.valid ?? true);
    });

    // Инициализируем начальное состояние
    this.areFormsValid = this.publicationForm.valid && (this.imageForm?.valid ?? true);
  }

  ngOnDestroy() {
    this.getCategoriesSubscription?.unsubscribe();
    this.getFormatsSubscription?.unsubscribe();
    this.getTimePeriodsSubscription?.unsubscribe();
    this.getSuitsSubscription?.unsubscribe();
    this.createPublication?.unsubscribe();
    this.updatePublicationSubscription?.unsubscribe();
  }

  getControlValidity(ctrlName: string, groupName: string | null = null) {
    if (groupName) {
      const ctrl = this.publicationForm.get(groupName).get([ctrlName])
      return ctrl.invalid && (ctrl?.dirty || ctrl?.touched) ? ctrl.errors : null
    }
    const ctrl = this.publicationForm.get([ctrlName])
    return ctrl.invalid && (ctrl?.dirty || ctrl?.touched) ? ctrl.errors : null
  }

  protected readonly highlightWeekend = highlightWeekend;
}
