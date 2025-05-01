import {Component} from '@angular/core';
import {DateFilterComponent} from '../../../shared/components/page-blocks/date-filter/date-filter.component';
import {DateFeedComponent} from '../../../shared/components/page-blocks/date-feed/date-feed.component';
import {PosterInfoComponent} from '../../../shared/components/events/poster-info/poster-info.component';
import {WindowsUtils} from '../../../shared/utils/windows-utils';
import {CityModalComponent} from '../../../shared/components/modals/city-modal/city-modal.component';
import {ParamModalComponent} from '../../../shared/components/modals/param-modal/param-modal.component';
import {NgClass, NgForOf} from '@angular/common';
import {EventCard2Component} from '../../../shared/components/cards/event-card2/event-card2.component';
import {ParamFilterComponent} from '../../../shared/components/param-filter/param-filter.component';

@Component({
  selector: 'app-events-list',
  imports: [
    DateFilterComponent,
    DateFeedComponent,
    PosterInfoComponent,
    CityModalComponent,
    ParamModalComponent,
    NgClass,
    EventCard2Component,
    NgForOf,
    ParamFilterComponent
  ],
  standalone: true,
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.scss'
})
export class EventsListComponent {
  chosenCity: string = 'Все города';
  isCityModalOpened: boolean = false;
  isParamModalOpened: boolean = false;
  calendarActive: boolean = false;

  toggleCalendarActive(value: boolean) {
    this.calendarActive = value;
  }

  toggleCityModal(value: boolean) {
    this.isCityModalOpened = value;
    WindowsUtils.fixBody(value)
  }

  toggleParamModal(value: boolean) {
    this.isParamModalOpened = value;
    WindowsUtils.fixBody(value)
  }

  chooseCity(value: string) {
    this.chosenCity = value;
  }

  protected readonly events = events;
  protected readonly filterObjects = filterObjects;
}

// ToDo remove after the Backend is ready

const events = [
  {
    img: "event4",
    day: "15",
    month: "Декабря",
    premium: "true",
    price: "от 1700₽",
    avatar: "avatar",
    master: "Дарья Солодаева",
    city: "Москва",
    title: "Парная йога",
    desc: "Раскачаем межбровный центр, пообщаемся с единомышленниками.",
    time: "2 дня",
    many: "true",
  },
  {
    img: "event5",
    day: "15",
    month: "Декабря",
    premium: "",
    price: "Бесплатно",
    avatar: "avatar2",
    master: "Андрей Филоменко",
    city: "Пермь",
    title: "Парная йога",
    desc: "Раскачаем межбровный центр, пообщаемся с единомышленниками.",
    time: "3 часа",
    many: "",
  },
  {
    img: "event6",
    day: "15",
    month: "Декабря",
    premium: "true",
    price: "от 1700₽",
    avatar: "avatar3",
    master: "Валентина Солодкина",
    city: "Нижний-<br>Новгород",
    title: "Баня с Валентиной Солодкиной",
    desc: "Раскачаем межбровный центр, пообщаемся с единомышленниками.",
    time: "2 дня",
    many: "true",
  },
  {
    img: "event4",
    day: "15",
    month: "Декабря",
    premium: "true",
    price: "от 1700₽",
    avatar: "avatar",
    master: "Дарья Солодаева",
    city: "Москва",
    title: "Парная йога",
    desc: "Раскачаем межбровный центр, пообщаемся с единомышленниками.",
    time: "2 дня",
    many: "true",
  },
  {
    img: "event5",
    day: "15",
    month: "Декабря",
    premium: "",
    price: "Бесплатно",
    avatar: "avatar2",
    master: "Андрей Филоменко",
    city: "Пермь",
    title: "Парная йога",
    desc: "Раскачаем межбровный центр, пообщаемся с единомышленниками.",
    time: "3 часа",
    many: "",
  },
  {
    img: "event6",
    day: "15",
    month: "Декабря",
    premium: "true",
    price: "от 1700₽",
    avatar: "avatar3",
    master: "Валентина Солодкина",
    city: "Нижний-<br>Новгород",
    title: "Баня с Валентиной Солодкиной",
    desc: "Раскачаем межбровный центр, пообщаемся с единомышленниками.",
    time: "2 дня",
    many: "true",
  },
  {
    img: "event4",
    day: "15",
    month: "Декабря",
    premium: "true",
    price: "от 1700₽",
    avatar: "avatar",
    master: "Дарья Солодаева",
    city: "Москва",
    title: "Парная йога",
    desc: "Раскачаем межбровный центр, пообщаемся с единомышленниками.",
    time: "2 дня",
    many: "true",
  },
  {
    img: "event5",
    day: "15",
    month: "Декабря",
    premium: "",
    price: "Бесплатно",
    avatar: "avatar2",
    master: "Андрей Филоменко",
    city: "Пермь",
    title: "Парная йога",
    desc: "Раскачаем межбровный центр, пообщаемся с единомышленниками.",
    time: "3 часа",
    many: "",
  },
  {
    img: "event6",
    day: "15",
    month: "Декабря",
    premium: "true",
    price: "от 1700₽",
    avatar: "avatar3",
    master: "Валентина Солодкина",
    city: "Нижний-<br>Новгород",
    title: "Баня с Валентиной Солодкиной",
    desc: "Раскачаем межбровный центр, пообщаемся с единомышленниками.",
    time: "2 дня",
    many: "true",
  }
]

const filterObjects: {title: string, options: string[], search: boolean, defaultOption?: string}[] = [
  {title: 'Формат', options: ['Формат 1', 'Формат 2'], search: false},
  {title: 'Категории', options: ['Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна'], search: true},
  {title: 'Тип мероприятия', options: ['Платное', 'Бесплатное'], search: false},
  {title: 'Для кого', options: ['Мужчинам', 'Женщинам'], search: false, defaultOption: 'Всем'},
  {title: 'Длительность', options: ['1 час', '2 часа'], search: false, defaultOption: 'Любая'},
  {title: 'Создатель мероприятия', options: ['Создатель 1', 'Создатель 2'], search: false},
]
