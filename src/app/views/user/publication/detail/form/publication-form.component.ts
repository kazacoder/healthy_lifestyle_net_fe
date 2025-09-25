import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable, of,
  Subscription,
  switchMap, tap
} from 'rxjs';
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
import {MatNativeDateModule, MatOption} from '@angular/material/core';
import {CommonUtils, highlightWeekend} from '../../../../../shared/utils/common-utils';
import {ErrorResponseType} from '../../../../../../types/error-response.type';
import {NgxMaskDirective} from 'ngx-mask';
import {AddressService} from '../../../../../shared/services/address.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {LocationRequestType} from '../../../../../../types/location-request.type';
import {StreetResponseType, StreetsResponseType} from '../../../../../../types/street-response.type';
import {HouseResponseType, HousesResponseType} from '../../../../../../types/house-response.type';
import {CitiesResponseType, CityResponseType} from '../../../../../../types/city-response.type';

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
    MatFormField,
    NgxMaskDirective,
    MatAutocompleteModule,
    MatOption,
    AsyncPipe
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
  offline: boolean = true;
  errors: ErrorResponseType | null = null;
  streets$!: Observable<any[]>;
  cities$!: Observable<any[]>;
  house$!: Observable<any[]>;
  streets: StreetResponseType[] = [];
  cities: CityResponseType[] = [];
  houses: HouseResponseType[] = [];
  protected readonly highlightWeekend = highlightWeekend;

  @Input() existingFilesIds: number[] = [];
  @Input() imageForm: FormGroup | null = null;
  @Input() imagesChanged: { main: boolean, additional: boolean } = {main: false, additional: false};
  @Input() currentPublication: PublicationType | null = null;

  publicationForm: any = this.fb.group({
    title: ['', Validators.required],
    phone: ['',],
    ticketAmount: [0, Validators.required],
    pricing: ['_free', Validators.required],
    price: [0, Validators.required],
    prepayment: [0],
    address: this.fb.group({
      city: ['', Validators.required],
      street: [{value: '', disabled: true,}, Validators.required],
      house: [{value: '', disabled: true,}, Validators.required],
      floor: ['',],
      office: ['',],
    }),
    duration: this.fb.group({
      amount: [null, Validators.required],
      timePeriod: ['1', Validators.required],
    }),

    suit: [null, Validators.required],
    format: [null, Validators.required],
    date: ['', Validators.required],
    whatsapp: ['',],
    telegram: ['', Validators.pattern(Settings.telegram_regex)],
    description: [null, Validators.required],
    categories: [[]]
  })

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private publicationService: PublicationService,
              private addressService: AddressService,
              private router: Router) {
    this.isMaster = this.userService.isMaster;

    const ctrlCity = this.publicationForm.get('address').get('city');
    this.cities$ = ctrlCity.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.cities = []),
      switchMap((value: string) => {
        if (value.length >= Settings.minCityQueryLength) {
          return this.addressService.getCitySuggest(value, 20).pipe(
            // мапим результат в массив объектов
            map((result: CitiesResponseType | DefaultResponseType) => (result as CitiesResponseType)
              .cities.map((city: CityResponseType) => {
                this.cities.push(city)
                return city
              })
            )
          )
        } else {
          return of([])
        }
      })
    );

    const ctrlStreet = this.publicationForm.get('address').get('street');
    this.streets$ = ctrlStreet.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.streets = []),
      switchMap((value: string) => {
        let locations: LocationRequestType = null
        if (ctrlCity.value['settlement_fias_id']) {
          locations = {settlement_fias_id: ctrlCity.value['settlement_fias_id']}
        } else if (ctrlCity.value['city_fias_id']) {
          locations = {city_fias_id: ctrlCity.value['city_fias_id']}
        }
        if (locations && value.length >= Settings.minStreetQueryLength) {
          return this.addressService.getStreetSuggest(value, locations, 10).pipe(
            // мапим результат в массив объектов
            map((result: StreetsResponseType | DefaultResponseType) => (result as StreetsResponseType)
              .streets.map((street: StreetResponseType) => {
                this.streets.push(street)
                return street
              })
            )
          )
        } else {
          return of([])
        }
      })
    );

    const ctrlHouse = this.publicationForm.get('address').get('house');
    this.house$ = ctrlHouse.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.houses = []),
      switchMap((value: string) => {
        const streetFiasId = ctrlStreet.value['street_fias_id']
        if (value.length >= Settings.minHouseQueryLength && streetFiasId) {
          return this.addressService.getHouseSuggest(value, streetFiasId, 10).pipe().pipe(
            // мапим результат в массив объектов
            map((result: HousesResponseType | DefaultResponseType) => (result as HousesResponseType)
              .houses.map((house: HouseResponseType) => {
                this.houses.push(house)
                return house
              })
            )
          )
        } else {
          return of([])
        }
      })
    );
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
            if (['city', 'street', 'house'].includes(key)) {
              if (value) {
                group.get(key).setValue(value); // объект с value, fias_id и т.д.
              }
            } else {
              group.get(key).setValue(value?.toString());
            }
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
    this.checkFormat();
  }

  displayValue(value: any): string {
    return value ? value.value : '';
  }

  validateOrAutocompleteAddressItemSelection(
    ctrlName: string,
    option: Array<HouseResponseType | StreetResponseType | CityResponseType> | null = null
  ) {
    const ctrl = this.publicationForm.get(ctrlName);
    const value = ctrl?.value;

    if (!value) {
      return
    } else if (typeof value === 'string') {
      if (option && option.length > 0) {
        ctrl.setValue(option[0])
      } else {
        // если значение — строка, значит пользователь не выбрал из списка
        ctrl?.setErrors({invalidChoice: true});
      }
    }
  }

  makeEventFree() {
    this.publicationForm.get('price').setValue(0)
    this.publicationForm.get('prepayment').setValue(0)
  }

  proceedBlur(
    ctrlName: string,
    option: Array<HouseResponseType | StreetResponseType | CityResponseType> | null = null,
    ctrlNameArray: string[]
  ) {
    this.validateOrAutocompleteAddressItemSelection(ctrlName, option)
    this.toggleCtrl(ctrlName, ctrlNameArray)
  }

  toggleCtrl(ctrlMasterName: string, ctrlSlaveNameArray: string[]) {
    const ctrl = this.publicationForm.get(ctrlMasterName)
    if (ctrl.invalid || !ctrl.value) {
      ctrlSlaveNameArray.forEach(ctrlName => {
        this.publicationForm.get(ctrlName).disable()
      })
    } else {
      this.publicationForm.get(ctrlSlaveNameArray[0]).enable()
    }
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
              if (['city', 'street', 'house'].includes(subKey)) {
                formData.append(publicationFormFieldsMatch[subKey as PubFormKey].field, JSON.stringify(subControl.value));
              } else {
                formData.append(publicationFormFieldsMatch[subKey as PubFormKey].field, subControl.value);
              }
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
      formData.append('duration', this.publicationForm.value.duration.amount);
      formData.append('time_period', this.publicationForm.value.duration.timePeriod);
      formData.append('suit', this.publicationForm.value.suit);
      formData.append('format', this.publicationForm.value.format);
      formData.append('date', CommonUtils.formatDate(this.publicationForm.value.date));
      formData.append('whatsapp', this.publicationForm.value.whatsapp);
      formData.append('telegram', this.publicationForm.value.telegram);
      formData.append('description', this.publicationForm.value.description);

      if (this.offline) {
        formData.append('city', JSON.stringify(this.publicationForm.value.address.city));
        formData.append('street', JSON.stringify(this.publicationForm.value.address.street));
        formData.append('house', JSON.stringify(this.publicationForm.value.address.house));
        formData.append('floor', this.publicationForm.value.address.floor);
        formData.append('office', this.publicationForm.value.address.office);
      }

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
            this.errors = errorResponse.error as ErrorResponseType;
            console.log(errorResponse)
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
            this.errors = errorResponse.error as ErrorResponseType;
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
            } else {
              console.log(errorResponse)
              this.errors = errorResponse.error as ErrorResponseType;
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

  getControlValidity(ctrlName: string, groupName: string | null = null, beFieldName: string | null = null): any {
    let ctrl = this.publicationForm.get(ctrlName)
    if (groupName) {
      ctrl = this.publicationForm.get(groupName).get(ctrlName)
    }
    if (!ctrl) {
      return null
    }
    return (ctrl.invalid && (ctrl?.dirty || ctrl?.touched) ||
      (this.errors && this.errors[beFieldName as keyof ErrorResponseType || ctrlName as keyof ErrorResponseType]))
      ? ctrl.errors || true : null
  }

  cleanError(key: keyof ErrorResponseType): void {
    if (this.errors?.hasOwnProperty(key)) {
      this.errors[key] = null;
    }
  }

  cleanControls(ctrlNameList: Array<string>) {
    ctrlNameList.forEach(ctrlName => {
      this.publicationForm.get(ctrlName).setValue('');
    })
  }

  checkFormat() {
    const formatId = parseInt(this.publicationForm.get('format').value);
    const address = this.publicationForm.get('address');
    const addressItems = [address.get('street'), address.get('house'), address.get('city')];
    if (!formatId) {
      address.disable();
      return;
    }

    if (Settings.offlineFormatsIDs.includes(formatId)) {
      address.enable();
      this.toggleCtrl('address.city', ['address.street', 'address.house'])
      this.toggleCtrl('address.street', ['address.house'])
      this.offline = true;
      addressItems.forEach(item => {
        item.setValidators(Validators.required);
        item.updateValueAndValidity();
        item.markAsPristine();
        item.markAsUntouched();
      })
    } else {
      addressItems.forEach(item => {
        item.clearValidators();
        item.updateValueAndValidity();
      });
      this.offline = false;
    }
  }

  ngOnDestroy() {
    this.getCategoriesSubscription?.unsubscribe();
    this.getFormatsSubscription?.unsubscribe();
    this.getTimePeriodsSubscription?.unsubscribe();
    this.getSuitsSubscription?.unsubscribe();
    this.createPublication?.unsubscribe();
    this.updatePublicationSubscription?.unsubscribe();
  }
}
