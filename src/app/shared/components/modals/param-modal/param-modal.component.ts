import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass} from '@angular/common';
import noUiSlider, {PipsMode} from 'nouislider';
import {RegionSelectComponent} from '../../ui/region-select/region-select.component';

@Component({
  selector: 'param-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass,
    RegionSelectComponent
  ],
  standalone: true,
  templateUrl: './param-modal.component.html',
  styleUrl: './param-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ParamModalComponent implements OnInit {
  @Input()
  isOpened: boolean = false;
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  modalType: 'event' | 'master' = "event"

  closeModal() {
    this.onCloseModal.emit(false);
    this.isOpened = false;
  }

  switchModalType(type: 'event' | 'master') {
    this.modalType = type;
  }

  ngOnInit() {

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
}
