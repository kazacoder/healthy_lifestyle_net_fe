import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {SwiperNavComponent} from '../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {SocialsComponent} from '../../../shared/components/ui/socials/socials.component';
import {EventCardComponent} from '../../../shared/components/cards/event-card/event-card.component';
import {NgForOf} from '@angular/common';
import {SwiperContainer} from 'swiper/element/bundle';

@Component({
  selector: 'app-master-detail',
  imports: [
    SwiperNavComponent,
    SocialsComponent,
    EventCardComponent,
    NgForOf
  ],
  standalone: true,
  templateUrl: './master-detail.component.html',
  styleUrl: './master-detail.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MasterDetailComponent implements AfterViewInit {

  masterSlider: SwiperContainer | null = null;
  masterSliderParams = {
    spaceBetween: 0,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    pagination: {
      el: `.swiper-pagination`,
      type: 'bullets',
      clickable: true,
    },
    navigation: {
      nextEl: `.master-slider2 .swiper-button-next`,
      prevEl: `.master-slider2 .swiper-button-prev`,
    },
  }
  ngAfterViewInit() {
    this.masterSlider = document.querySelector('.master-swiper');
    if (this.masterSlider) {
      Object.assign(this.masterSlider, this.masterSliderParams);
      this.masterSlider.initialize();
    }
  }
}
