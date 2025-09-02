import {AfterContentChecked, Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {SwiperNavComponent} from '../../../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {SwiperContainer} from 'swiper/element/bundle';
import {NgForOf, NgIf} from '@angular/common';
import {EventCard3Component} from '../../../../../shared/components/cards/event-card3/event-card3.component';
import {EventType} from '../../../../../../types/event.type';

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
export class EventCollectionMasterComponent implements AfterContentChecked {
  @Input() title: string = '';
  @Input() index: string = '';
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
      nextEl: `.events-slider-master .swiper-button-next`,
      prevEl: `.events-slider-master .swiper-button-prev`,
    },
  }

  ngAfterContentChecked(): void {
    this.eventSwiper = document.querySelector('.event-swiper-master' + this.index);
    if (this.index) {
      this.eventSwiperParams.navigation = {
        nextEl: '#swiper-button-next-' + this.index,
        prevEl: '#swiper-button-prev-' + this.index,
      }
    }

    if (this.eventSwiper) {
      Object.assign(this.eventSwiper, this.eventSwiperParams);
      this.eventSwiper.initialize();
    }
  }
}


