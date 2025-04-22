import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {DateItemComponent} from '../../cards/date-item/date-item.component';
import {SwiperContainer} from 'swiper/element/bundle';
import 'swiper/css/navigation'
import 'swiper'
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'date-feed',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [DateItemComponent, NgForOf, NgClass],
  templateUrl: './date-feed.component.html',
  styleUrl: './date-feed.component.scss'
})
export class DateFeedComponent implements AfterViewInit {
  daysOffset = 30;
  daysInDateFeed = 100 ;
  dates: {date: string, month: string, class: string, weekDay: string}[] = [];
  dateSwiper: SwiperContainer | null = null;
  dateSwiperParams = {
    slidesPerView: 26,
    slidesPerGroup: 26,
    spaceBetween: 0,
    allowTouchMove: false,
    initialSlide: this.daysOffset,
    navigation: {
      nextEl: '.date-feed .swiper-button-next',
      prevEl: '.date-feed .swiper-button-prev',
    },
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
      init: () => {
        if (window.innerWidth > 992) {
          // console.log(1111)
          // this.slideTo(this.slides.length-1,0)
          // this.dateSwiper!.initialSlide(10)
        }
      },
      navigationNext: function () {
        console.log('navigation next');
      }
    }
  };

  constructor() {
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
      "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    let today = new Date();
    today.setDate(today.getDate() - this.daysOffset);
    for (let i = 0; i < this.daysInDateFeed; i++) {
      let className = ''
      const day = today.getDay();
      const dateDay = today.getDate()
      className += (day === 0 || day === 6 ? '_weekend' : '')
      className += (dateDay === 1 || i === 0 ? ' _first-day' : '')
      this.dates.push({
        date: dateDay.toString(),
        month: months[today.getMonth()],
        weekDay: days[day],
        class: className
      });
      today.setDate(today.getDate() + 1);
    }
  }

  ngAfterViewInit() {
    this.dateSwiper = document.querySelector('.date-swiper');
    if (this.dateSwiper) {
      Object.assign(this.dateSwiper, this.dateSwiperParams);
      this.dateSwiper.initialize();
      // this.dateSwiper.swiper.slideTo(60);
    }
  }
}



