import { Component } from '@angular/core';
import {MasterCardComponent} from '../../../shared/components/cards/master-card/master-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {PosterInfoComponent} from '../../../shared/components/events/poster-info/poster-info.component';
import {CityModalComponent} from '../../../shared/components/modals/city-modal/city-modal.component';
import {WindowsUtils} from '../../../shared/utils/windows-utils';
import {ParamFilterComponent} from '../../../shared/components/param-filter/param-filter.component';
import {SortComponent} from '../../../shared/components/ui/sort/sort.component';

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
export class MastersListComponent {
  isCityModalOpened: boolean = false;
  chosenCity: string = 'Все города';

  protected readonly masters = masters;
  protected readonly filterObjects = filterObjects;

  toggleCityModal(value: boolean) {
    this.isCityModalOpened = value;
    WindowsUtils.fixBody(value)
  }

  chooseCity(value: string) {
    this.chosenCity = value;
  }
}

// ToDo remove after the Backend is ready

const masters = [
  {
    img: "master",
    city: "Москва",
    title: "Притула Ирина",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master2",
    city: "Москва",
    title: "Филименко Андрей",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master3",
    city: "Москва",
    title: "Марченко Елена",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master2",
    city: "Москва",
    title: "Филименко Андрей",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master",
    city: "Москва",
    title: "Притула Ирина",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master2",
    city: "Москва",
    title: "Филименко Андрей",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master3",
    city: "Москва",
    title: "Марченко Елена",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master2",
    city: "Москва",
    title: "Филименко Андрей",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master",
    city: "Москва",
    title: "Притула Ирина",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master2",
    city: "Москва",
    title: "Филименко Андрей",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master3",
    city: "Москва",
    title: "Марченко Елена",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
  {
    img: "master2",
    city: "Москва",
    title: "Филименко Андрей",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  },
]

const filterObjects: {title: string, options: string[], search: boolean, defaultOption?: string}[] = [
  {title: 'Формат занятий', options: ['Формат 1', 'Формат 2'], search: false},
  {title: 'Стаж', options: ['1 год', '2 года'], search: false, defaultOption: 'Любой'},
  {title: 'Вид деятельности', options: ['Деятельность', 'Деятельность', 'Деятельность', 'Деятельность', 'Деятельность',
      'Деятельность', 'Деятельность', 'Деятельность', 'Деятельность', 'Деятельность', 'Деятельность', 'Деятельность'],
    search: true},
]
