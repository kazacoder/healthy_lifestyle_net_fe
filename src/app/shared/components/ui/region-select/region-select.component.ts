import { Component } from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'region-select',
  imports: [
    NgClass,
    NgForOf,
    FormsModule
  ],
  standalone: true,
  templateUrl: './region-select.component.html',
  styleUrl: './region-select.component.scss'
})
export class RegionSelectComponent {
  isOpenDropDown = false;
  currentCity: string = 'Москва'

  regionSelectToggle() {
    this.isOpenDropDown = !this.isOpenDropDown;
  }

  protected readonly cities = cities;
}

const cities = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Уфа',
  'Самара',
  'Сочи',
  'Владивосток',
  'Краснодар',
]
