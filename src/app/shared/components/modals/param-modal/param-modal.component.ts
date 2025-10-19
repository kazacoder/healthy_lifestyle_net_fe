import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass, NgForOf} from '@angular/common';
import noUiSlider, {PipsMode} from 'nouislider';
import {RegionSelectComponent} from '../../ui/region-select/region-select.component';
import {PublicationService} from '../../../services/publication.service';
import {CategoryType} from '../../../../../types/category.type';
import {Subscription} from 'rxjs';
import {EventType} from '@angular/router';
import {FormsModule} from '@angular/forms';

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
  categoryOpen: boolean = false

  getCategoriesSubscription: Subscription | null = null;

  constructor(private publicationService: PublicationService,) {
  }

  closeModal() {
    this.onCloseModal.emit(false);
    this.isOpened = false;
  }

  switchModalType(type: 'event' | 'master') {
    this.modalType = type;
  }

  ngOnInit() {

    this.getCategoriesSubscription = this.publicationService.categoryList$.subscribe(categories => {
      this.categoriesInitial = categories;
      this.categoriesInitial.forEach(cat => cat.selected = false);
      this.categories = this.categoriesInitial;
    })

    let filterSliders = document.querySelectorAll(".filter-slider")
    filterSliders.forEach((slider, i) => {
      const rangeSlider: any = slider.querySelector(`.range-slider`);
      const sliderItemsCount =  (slider as any).dataset.max - 1;
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
              to: function(value) {
                let targetIndex = value > 0 ? sliderItemsCount - Math.ceil(100 / value) + 1 : 0;
                return (document.querySelectorAll(`.filter-slider__bottom.slider-${i} .filter-slider__title`)[targetIndex] as HTMLElement).innerText
              }
            }
          }
        });
      }
      if (rangeSlider) {
        rangeSlider.noUiSlider.on('change', function(values: any, handle: any) {
          let value = Number(values[0]);
          const span = 100 / sliderItemsCount
          let valueSanitized = Math.abs((value % span) / span) < 0.3 ? Math.round(value / span) * span : Math.ceil(value / span) * span;
          if (value !== valueSanitized) {
            rangeSlider.noUiSlider.set(valueSanitized);
          }
          console.log(rangeSlider.noUiSlider.get(valueSanitized));
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

  clear() {
    this.categories = this.categoriesInitial;
    this.chosenCategories = [];
    this.categoriesInitial.forEach(cat => cat.selected = false);
  }

  toggleCategoryDropdown(isOpen: boolean = false) {
    this.categoryOpen = !this.categoryOpen;
  }

  ngOnDestroy() {
    this.getCategoriesSubscription?.unsubscribe();
  }
}
