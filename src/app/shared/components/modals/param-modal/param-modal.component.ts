import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass, NgForOf} from '@angular/common';
import noUiSlider, {PipsMode} from 'nouislider';
import {RegionSelectComponent} from '../../ui/region-select/region-select.component';
import {PublicationService} from '../../../services/publication.service';
import {CategoryType} from '../../../../../types/category.type';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {SpecialityType} from '../../../../../types/speciality.type';
import {SpecialityService} from '../../../services/speciality.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {FiltersDataType} from '../../../../../types/filters-data.type';
import {EventService} from '../../../services/event.service';
import {FormatType} from '../../../../../types/format.type';
import {SuitType} from '../../../../../types/suit.type';

@Component({
  selector: 'param-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass,
    RegionSelectComponent,
    NgForOf,
    FormsModule
  ],
  standalone: true,
  templateUrl: './param-modal.component.html',
  styleUrl: './param-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ParamModalComponent implements OnInit, OnDestroy {
  @Input() isOpened: boolean = false;
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  modalType: 'event' | 'master' = "event"
  categories: CategoryType[] = [];
  categoriesInitial: CategoryType[] = [];
  chosenCategories: CategoryType[] = [];
  dropdown = {
    categoryOpen: false,
    durationOpen: false,
    experienceOpen: false,
    specialityOpen: false,
  }
  categoryOpen: boolean = false;
  specialities: SpecialityType[] = [];
  specialitiesInitial: SpecialityType[] = [];
  chosenSpecialities: SpecialityType[] = [];
  specialitiesOpen: boolean = false;
  duration: number = 0;
  experience: number = 0;
  rangeSliders: any[] = [];
  formatOption: FormatType[] = [{id: 'all', title: 'Все'}];
  formatChosen = 'all';
  typeOption: FormatType[] = [];
  typeChosen = 'all';
  suitOption: SuitType[] = [];
  suitChosen = 'all';
  creatorChosen = 'all';
  genderChosen = 'all';
  durationOption: FormatType[] = [];

  getCategoriesSubscription: Subscription | null = null;
  getSpecialitiesSubscription: Subscription | null = null;
  getEventFiltersSubscription: Subscription | null = null;

  constructor(private publicationService: PublicationService,
              private specialityService: SpecialityService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private eventService: EventService) {
  }

  closeModal() {
    this.onCloseModal.emit(false);
    this.isOpened = false;
  }

  switchModalType(type: 'event' | 'master') {
    this.modalType = type;
  }

  ngOnInit() {

    this.typeOption = [{id: 'all', title: 'Все'}, {id: 'paid', title: 'Платное'}, {id: 'free', title: 'Бесплатное'}];
    this.durationOption = [{id: 'all', title: 'Любая'}, {id: '1_1', title: '1 час'}, {id: '2_1', title: '2 часа'}, {id: '1_2', title: '1 день'}];

    this.getEventFiltersResponse();

    this.getCategoriesSubscription = this.publicationService.categoryList$.subscribe(categories => {
      this.categoriesInitial = categories;
      this.categoriesInitial.forEach(cat => cat.selected = false);
      this.categories = this.categoriesInitial;
    })

    this.getSpecialitiesSubscription = this.specialityService.getSpecialityList().subscribe({
      next: (data: SpecialityType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          console.log(error);
          throw new Error(error);
        }
        this.specialitiesInitial = data as SpecialityType[];
        this.categoriesInitial.forEach(cat => cat.selected = false);
        this.specialities = this.specialitiesInitial;
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          console.log(errorResponse.error.detail)
        } else {
          console.log('Ошибка получения данных')
        }
      }
    })

    let filterSliders = document.querySelectorAll(".filter-slider")
    filterSliders.forEach((slider, i) => {
      const rangeSlider: any = slider.querySelector(`.range-slider`);
      this.rangeSliders.push(rangeSlider)
      const sliderItemsCount = (slider as any).dataset.max - 1;
      const rangeInput = slider.querySelector(`.range-slider__input`);

      if (rangeSlider) {
        noUiSlider.create(rangeSlider, {
          start: 0,
          connect: [true, false],
          step: 1,
          range: {
            min: 0,
            max: 100
          },
          pips: {
            mode: PipsMode.Range,
            density: 1,
            filter: function filterPips(value, type) {
              return value % (100 / sliderItemsCount) ? -1 : 1;
            },
            format: {
              to: function (value) {
                let targetIndex = Math.ceil(sliderItemsCount * value / 100);
                return (document.querySelectorAll(`.filter-slider__bottom.slider-${i} .filter-slider__title`)[targetIndex] as HTMLElement).innerText
              }
            }
          }
        });
      }
      if (rangeSlider) {
        rangeSlider.noUiSlider.on('change', (values: any, handle: any) => {
          let value = Number(values[0]);
          const span = 100 / sliderItemsCount
          let valueSanitized = Math.abs((value % span) / span) < 0.3 ? Math.round(value / span) * span : Math.ceil(value / span) * span;
          rangeSlider.noUiSlider.set(valueSanitized);
          this.duration = sliderItemsCount * valueSanitized / 100
          this.experience = sliderItemsCount * valueSanitized / 100
        });
      }
    })
  }

  choseCategory(cat: CategoryType) {
    const catInvert: CategoryType = {
      id: cat.id,
      title: cat.title,
      image: cat.image,
      selected: !cat.selected
    }

    if (this.chosenCategories.includes(cat || catInvert)) {
      if (cat.selected === false) {
        this.removeCategory(cat)
      }
      return
    }
    cat.selected = true;
    this.chosenCategories.push(cat);
    this.categories = this.categories.filter(category => category.id !== cat.id)
  }

  choseSpeciality(spec: SpecialityType) {
    const specInvert: SpecialityType = {
      id: spec.id,
      title: spec.title,
      selected: !spec.selected
    }

    if (this.chosenSpecialities.includes(spec || specInvert)) {
      if (spec.selected === false) {
        this.removeSpeciality(spec)
      }
      return
    }
    spec.selected = true;
    this.chosenSpecialities.push(spec);
    this.specialities = this.specialities.filter(speciality => speciality.id !== spec.id)
  }

  removeCategory(cat: CategoryType) {
    this.chosenCategories = this.chosenCategories.filter(category => category.id !== cat.id);
    this.categories = this.categoriesInitial.filter(category => {
      return !this.chosenCategories.includes(category)
    })
    const catInInitial = this.categoriesInitial.filter(category => category.id === cat.id)
    if (catInInitial.length > 0) {
      catInInitial[0].selected = false
    }
  }

  removeSpeciality(spec: SpecialityType) {
    this.chosenSpecialities = this.chosenSpecialities.filter(speciality => speciality.id !== spec.id);
    this.specialities = this.specialitiesInitial.filter(speciality => {
      return !this.chosenSpecialities.includes(speciality)
    })
    const specInInitial = this.specialitiesInitial.filter(speciality => speciality.id === spec.id)
    if (specInInitial.length > 0) {
      specInInitial[0].selected = false
    }
  }

  clear() {
    this.categories = this.categoriesInitial;
    this.chosenCategories = [];
    this.categoriesInitial.forEach(cat => cat.selected = false);

    this.specialities = this.specialitiesInitial;
    this.chosenSpecialities = [];
    this.categoriesInitial.forEach(spec => spec.selected = false)


    this.formatChosen = 'all';
    this.typeChosen = 'all';
    this.suitChosen = 'all';
    this.creatorChosen = 'all';
    this.genderChosen = 'all';

    this.router.navigate([]).then();
    this.rangeSliders.forEach(slider => slider.noUiSlider.set(0));
  }

  apply(type: 'events' | 'masters') {
    this.closeModal();
    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
      ['categories']: type === 'events' ? this.chosenCategories.map(cat => cat.id): undefined,
      ['specialities']: type === 'masters' ? this.chosenSpecialities.map(spec => spec.id) : undefined,
      ['duration']: this.duration && type === 'events' ? this.duration : undefined,
      ['experience']: this.experience && type === 'masters' ? this.experience : undefined,
      ['format']: this.formatChosen === 'all' ? undefined : this.formatChosen, // for both filters
      ['type']: this.typeChosen === 'all' || type === 'masters' ? undefined : this.typeChosen,
      ['suit']: this.suitChosen === 'all' || type === 'masters' ? undefined : this.suitChosen,
      ['creator']: this.creatorChosen === 'all' || type === 'masters' ? undefined : this.creatorChosen,
      ['gender']: this.genderChosen === 'all' || type === 'events' ? undefined : this.genderChosen,
    }

    this.router.navigate(['/' + type], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'replace'
    }).then();
  }

  getEventFiltersResponse() {
    this.getEventFiltersSubscription = this.eventService.getFiltersDataMain().subscribe({
      next: (data: FiltersDataType | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          console.log(error);
          throw new Error(error);
        }
        const filters = data as FiltersDataType
        this.formatOption.push(...filters.formats);
        this.suitOption.push(...filters.suits);
       },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          console.log(errorResponse.error.detail)
        } else {
          console.log('Ошибка получения данных фильтров')
        }
      }
    });
  }

  toggleCategoryDropdown(type: 'categoryOpen' | 'durationOpen' | 'experienceOpen' |'specialityOpen') {
    this.dropdown[type] = !this.dropdown[type]
  }

  ngOnDestroy() {
    this.getCategoriesSubscription?.unsubscribe();
    this.getSpecialitiesSubscription?.unsubscribe();
    this.getEventFiltersSubscription?.unsubscribe();
  }
}
