import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, HostListener} from '@angular/core';
import {PosterInfoComponent} from '../../shared/components/events/poster-info/poster-info.component';
import {DateFeedComponent} from '../../shared/components/page-blocks/date-feed/date-feed.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {DateFilterComponent} from '../../shared/components/page-blocks/date-filter/date-filter.component';
import {EventCardComponent} from '../../shared/components/cards/event-card/event-card.component';
import {SwiperContainer} from 'swiper/element/bundle';
import {SwiperNavComponent} from '../../shared/components/ui/swiper-nav/swiper-nav.component';
import {EventCard2Component} from '../../shared/components/cards/event-card2/event-card2.component';
import {MasterCardComponent} from '../../shared/components/cards/master-card/master-card.component';
import {RouterLink} from '@angular/router';
import {CityModalComponent} from '../../shared/components/modals/city-modal/city-modal.component';
import {WindowsUtils} from '../../shared/utils/windows-utils';
import {ParamModalComponent} from '../../shared/components/modals/param-modal/param-modal.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [PosterInfoComponent, DateFeedComponent, NgIf, DateFilterComponent, EventCardComponent, SwiperNavComponent, NgForOf, EventCard2Component, NgClass, MasterCardComponent, RouterLink, CityModalComponent, ParamModalComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class MainComponent implements AfterViewInit {

  //ToDo
  eventsTempData = events
  eventsTempData2 = events2
  mastersTempData = masters

  isCityModalOpened:boolean = false;
  isParamModalOpened:boolean = false;
  calendarActive: boolean = false;
  chosenCity: string = 'Все города';

  eventSwiper: SwiperContainer | null = null;
  eventSwiperParams = {
    spaceBetween: 0,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: `.events-slider .swiper-button-next`,
      prevEl: `.events-slider .swiper-button-prev`,
    },
  }

  event2Swiper: SwiperContainer | null = null;
  event2SwiperParams = {
    spaceBetween: 0,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: `.events-slider2 .swiper-button-next`,
      prevEl: `.events-slider2 .swiper-button-prev`,
    },
  }

  masterSwiper: SwiperContainer | null = null;
  masterSwiperParams = {
    spaceBetween: 0,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: `.master-slider .swiper-button-next`,
      prevEl: `.master-slider .swiper-button-prev`,
    },
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    (event.target as Window).innerWidth;
  }

  ngAfterViewInit() {
    this.eventSwiper = document.querySelector('.event-swiper');
    if (this.eventSwiper) {
      Object.assign(this.eventSwiper, this.eventSwiperParams);
      this.eventSwiper.initialize();
    }

    this.event2Swiper = document.querySelector('.nearest-events');
    if (this.event2Swiper) {
      Object.assign(this.event2Swiper, this.event2SwiperParams);
      this.event2Swiper.initialize();
    }

    this.masterSwiper = document.querySelector('.master-swiper');
    if (this.masterSwiper) {
      Object.assign(this.masterSwiper, this.masterSwiperParams);
      this.masterSwiper.initialize();
    }
    WindowsUtils.fix100vh()
  }

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
    console.log('here')
  }

  chooseCity(value: string) {
    this.chosenCity = value;
  }
}


//ToDo remove after backend is ready

const events = [
  {
    img: "event",
    day: "4",
    month: "Марта",
    type: "Йога",
    typeIcon: "type-icon",
    title: "Центр йоги №1",
  },
  {
    img: "event2",
    day: "25",
    month: "Мая",
    type: "Баня",
    typeIcon: "type-icon2",
    title: "Перовские бани",
  },
  {
    img: "event3",
    day: "8",
    month: "Апреля",
    type: "Йога",
    typeIcon: "type-icon",
    title: "Центр йоги №1",
  },
  {
    img: "event3",
    day: "8",
    month: "Апреля",
    type: "Йога",
    typeIcon: "type-icon",
    title: "Центр йоги №1",
  },
  {
    img: "event2",
    day: "25",
    month: "Мая",
    type: "Баня",
    typeIcon: "type-icon2",
    title: "Перовские бани",
  },
  {
    img: "event3",
    day: "8",
    month: "Апреля",
    type: "Йога",
    typeIcon: "type-icon",
    title: "Центр йоги №1",
  },
  {
    img: "event3",
    day: "8",
    month: "Апреля",
    type: "Йога",
    typeIcon: "type-icon",
    title: "Центр йоги №1",
  }
]

const events2 = [
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
    img: "master3",
    city: "Москва",
    title: "Марченко Елена",
    desc: "Описание основной сферы деятельности мастера в 2х предложениях",
  }
]
