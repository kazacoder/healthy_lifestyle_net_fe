import {AfterContentChecked, Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {SwiperNavComponent} from '../../../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {SwiperContainer} from 'swiper/element';
import {EventCard3Component} from '../../../../../shared/components/cards/event-card3/event-card3.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {EventType} from '../../../../../../types/event.type';

@Component({
  selector: 'event-collection-history',
  imports: [
    SwiperNavComponent,
    EventCard3Component,
    NgForOf,
    NgClass,
    NgIf
  ],
  standalone: true,
  templateUrl: './event-collection-history.component.html',
  styleUrl: './event-collection-history.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventCollectionHistoryComponent implements AfterContentChecked {
  @Input() title: string = '';
  @Input() events: EventType[] = [];

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
    cssMode: true,
    navigation: {
      nextEl: `.events-slider-history .swiper-button-next`,
      prevEl: `.events-slider-history .swiper-button-prev`,
    },
  }

  ngAfterContentChecked(): void {
    this.eventSwiper = document.querySelector('.event-swiper-history');
    if (this.eventSwiper) {
      Object.assign(this.eventSwiper, this.eventSwiperParams);
      this.eventSwiper.initialize();
    }
  }
}

