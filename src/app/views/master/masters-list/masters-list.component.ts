import { Component } from '@angular/core';
import {MasterCardComponent} from '../../../shared/components/cards/master-card/master-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {PosterInfoComponent} from '../../../shared/components/events/poster-info/poster-info.component';
import {CityModalComponent} from '../../../shared/components/modals/city-modal/city-modal.component';
import {WindowsUtils} from '../../../shared/utils/windows-utils';

@Component({
  selector: 'app-masters-list',
  imports: [
    MasterCardComponent,
    NgForOf,
    PosterInfoComponent,
    CityModalComponent,
    NgIf
  ],
  standalone: true,
  templateUrl: './masters-list.component.html',
  styleUrl: './masters-list.component.scss'
})
export class MastersListComponent {
  masters = masters;
  isCityModalOpened: boolean = false;
  chosenCity: string = 'Все города';

  toggleCityModal(value: boolean) {
    this.isCityModalOpened = value;
    WindowsUtils.fixBody(value)
  }

  chooseCity(value: string) {
    this.chosenCity = value;
  }
}



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
