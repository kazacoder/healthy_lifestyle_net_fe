import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {DateItemComponent} from '../../cards/date-item/date-item.component';
import {SwiperContainer} from 'swiper/element/bundle';
// import 'swiper/css/navigation'
import 'swiper'
import {CommonModule, DatePipe, NgClass, NgForOf} from '@angular/common';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'date-feed',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [DateItemComponent, NgForOf, NgClass, CommonModule],
  providers: [DatePipe],
  templateUrl: './date-feed.component.html',
  styleUrl: './date-feed.component.scss'
})
export class DateFeedComponent implements OnInit, AfterViewInit {
  daysOffset = 30;
  daysInDateFeed = 100;
  activatedRouterSubscription: Subscription | null = null;
  dates: { date: string | null, day: string, month: string, class: string, weekDay: string }[] = [];
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
      },
      click: () => {
        const idx = this.dateSwiper?.swiper.clickedIndex;
        if (idx) {
          if (this.dates.filter(item => item.class.includes('_selected')).length > 1) {
            this.dates.map(item => {
              if (item.class.includes('_weekend')) {
                item.class = '_weekend'
              } else {
                item.class = ''
              }
            })
          }
          this.dates[idx].class = '_selected';
          console.log(this.dates[idx].date);
        }
      }
    }
  };

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private datePipe: DatePipe,) {
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
        date: this.datePipe.transform(today, 'yyyy-MM-dd'),
        day: dateDay.toString(),
        month: months[today.getMonth()],
        weekDay: days[day],
        class: className
      });
      today.setDate(today.getDate() + 1);
    }
  }

  ngOnInit() {
    this.activatedRouterSubscription = this.activatedRoute.queryParams.subscribe(params => {
      const dateForm = params['date_from']
      const dateTo = params['date_to']
      console.log(new Date(dateForm))
      console.log(this.dates[35].date)
      const dateFromIndex = this.dates.findIndex(item => item.date === dateForm)
      const dateToIndex = this.dates.findIndex(item => item.date === dateTo)

      this.dates.map(item => {
        if (item.class.includes('_weekend')) {
          item.class = '_weekend'
        } else {
          item.class = ''
        }
      })

      if (dateFromIndex !== -1) {
        this.dates[dateFromIndex].class = '_selected';
        if (dateTo) {
          this.dates[dateToIndex].class = '_selected';
        }
      }
    });
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



