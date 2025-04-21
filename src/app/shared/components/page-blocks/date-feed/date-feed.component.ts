import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {DateItemComponent} from '../../cards/date-item/date-item.component';
import Swiper from 'swiper';
// import 'swiper/css/navigation'
// import 'swiper'
import {NgForOf} from '@angular/common';

@Component({
  selector: 'date-feed',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [DateItemComponent, NgForOf],
  templateUrl: './date-feed.component.html',
  styleUrl: './date-feed.component.scss'
})
export class DateFeedComponent implements AfterViewInit {

  dates: string[] = []

  constructor() {
    for (let i = 0; i < 100; i++) {
      this.dates.push('1');
    }
  }

  ngAfterViewInit() {
    console.log('date-feed');
    const dateSwiper = new Swiper('.swiper111', {
      slidesPerView: 26,
      slidesPerGroup: 26,
      spaceBetween: 0,
      allowTouchMove: false,
      navigation: true,
      // navigation: {
      //   nextEl: '.date-feed .swiper-button-next',
      //   prevEl: '.date-feed .swiper-button-prev',
      // },
      breakpoints: {
        100: {
          slidesPerView: "auto",
          slidesPerGroup: 1,
          allowTouchMove: true,
        },
        992: {
          slidesPerView: 27,
          slidesPerGroup: 27,
          allowTouchMove: false,
        },
      },
      on: {
        init: function () {
          if(window.innerWidth>992){
            console.log(1111)
            // this.slideTo(this.slides.length-1,0)
          }
        },
        navigationNext: function () {
          console.log('navigation next');
        }
      },
    });
    console.log(dateSwiper);
    console.log(dateSwiper.navigation);
    console.log(document.querySelector('.swiper-button-next'))
  }

}



