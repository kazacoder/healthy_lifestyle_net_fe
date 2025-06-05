import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {SwiperNavComponent} from '../../../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {SwiperContainer} from 'swiper/element/bundle';
import {NgForOf, NgIf} from '@angular/common';
import {EventCard3Component} from '../../../../../shared/components/cards/event-card3/event-card3.component';

@Component({
  selector: 'event-collection-master',
  imports: [
    SwiperNavComponent,
    NgIf,
    EventCard3Component,
    NgForOf
  ],
  standalone: true,
  templateUrl: './event-collection-master.component.html',
  styleUrl: './event-collection-master.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventCollectionMasterComponent implements AfterViewInit {
  @Input() title: string = '';

  eventSwiper: SwiperContainer | null = null;
  eventSwiperParams = {
    slidesPerView: "auto",
    spaceBetween: 0,
    watchSlidesProgress: true,
    preventClicks :true,
    a11y: false,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    navigation: {
      nextEl: `.events-slider-master .swiper-button-next`,
      prevEl: `.events-slider-master .swiper-button-prev`,
    },
  }

  ngAfterViewInit(): void {
    this.eventSwiper = document.querySelector('.event-swiper-master');
    if (this.eventSwiper) {
      Object.assign(this.eventSwiper, this.eventSwiperParams);
      this.eventSwiper.initialize();
    }
  }

  protected readonly tmpEvent = tmpEvent;
}


const tmpEvent = [
  {
    img: "event4",
    day: "15",
    month: "Декабря",
    title: "Парная йога",
  },

  {
    img: "event5",
    day: "15",
    month: "Декабря",
    title: "Парная йога",
  },

  {
    img: "event6",
    day: "15",
    month: "Декабря",
    title: "Баня с Валентиной Солодкиной",
  },

  {
    img: "event6",
    day: "15",
    month: "Декабря",
    title: "Баня с Валентиной Солодкиной",
  },
]
