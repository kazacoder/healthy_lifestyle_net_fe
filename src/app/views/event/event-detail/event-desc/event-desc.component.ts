import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SwiperNavComponent} from '../../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {EventCard2Component} from '../../../../shared/components/cards/event-card2/event-card2.component';
import {SwiperContainer} from 'swiper/element/bundle';
import {AdditionalImageType} from '../../../../../types/additional-image.type';

@Component({
  selector: 'event-desc',
  imports: [
    NgIf,
    SwiperNavComponent,
    EventCard2Component,
    NgForOf,
    NgClass
  ],
  standalone: true,
  templateUrl: './event-desc.component.html',
  styleUrl: './event-desc.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventDescComponent implements AfterViewInit, OnChanges {

  @Input() alreadyBooked: boolean = true;
  @Input() description: string | undefined = '';
  @Input() tg: string | undefined | null = '';
  @Input() whatsapp: string | undefined | null = '';
  @Input() photos: AdditionalImageType[] | null | undefined = undefined;
  photoSwiper: SwiperContainer | null = null;
  hideNavigation: boolean = false;
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

  ngOnChanges() {
    this.hideNavigation = !this.photos || this.photos.length === 0;
  }

  ngAfterViewInit(): void {
    this.photoSwiper = document.querySelector('.event-swiper-photo');
    if (this.photoSwiper) {
      Object.assign(this.photoSwiper, this.photoSwiperParams);
      this.photoSwiper.initialize();
    }

  }

}
