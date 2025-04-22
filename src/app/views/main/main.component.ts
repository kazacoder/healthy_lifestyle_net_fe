import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {PosterInfoComponent} from '../../shared/components/events/poster-info/poster-info.component';
import {DateFeedComponent} from '../../shared/components/page-blocks/date-feed/date-feed.component';
import {NgForOf, NgIf} from '@angular/common';
import {DateFilterComponent} from '../../shared/components/page-blocks/date-filter/date-filter.component';
import {EventCardComponent} from '../../shared/components/cards/event-card/event-card.component';
import {SwiperContainer} from 'swiper/element/bundle';
import {SwiperNavComponent} from '../../shared/components/ui/swiper-nav/swiper-nav.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [PosterInfoComponent, DateFeedComponent, NgIf, DateFilterComponent, EventCardComponent, SwiperNavComponent, NgForOf],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainComponent implements AfterViewInit {

  //ToDo
  eventsTempData = [
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

  ngAfterViewInit() {
    this.eventSwiper = document.querySelector('.event-swiper');
    if (this.eventSwiper) {
      Object.assign(this.eventSwiper, this.eventSwiperParams);
      this.eventSwiper.initialize();
    }
  }
}
