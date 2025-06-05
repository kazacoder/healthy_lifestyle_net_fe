import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {SwiperNavComponent} from '../../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {EventCard2Component} from '../../../../shared/components/cards/event-card2/event-card2.component';
import {SwiperContainer} from 'swiper/element/bundle';

@Component({
  selector: 'event-desc',
  imports: [
    NgIf,
    SwiperNavComponent,
    EventCard2Component,
    NgForOf
  ],
  standalone: true,
  templateUrl: './event-desc.component.html',
  styleUrl: './event-desc.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventDescComponent implements AfterViewInit {

  @Input() alreadyBooked: boolean = true;
  photoSwiper: SwiperContainer | null = null;
  photoSwiperParams = {
    slidesPerView: "auto",
    spaceBetween: 0,
    watchSlidesProgress: true,
    preventClicks :true,
    a11y: false,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    navigation: {
      nextEl: `.events-slide-photo .swiper-button-next`,
      prevEl: `.events-slide-photo .swiper-button-prev`,
    },
  }

  ngAfterViewInit(): void {
    this.photoSwiper = document.querySelector('.event-swiper-photo');
    if (this.photoSwiper) {
      Object.assign(this.photoSwiper, this.photoSwiperParams);
      this.photoSwiper.initialize();
    }
  }

}
