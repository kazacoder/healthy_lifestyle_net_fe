import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
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
export class DateFeedComponent implements OnInit, AfterViewInit, OnDestroy {
  daysOffset = 30;
  daysInDateFeed = 100;
  activatedRouterSubscription: Subscription | null = null;
  dates: { date: string | null, day: string, month: string, class: string, weekDay: string }[] = [];
  dateSwiper: SwiperContainer | null = null;
  period: (string | null)[] = []
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
      },
      click: () => {
        const idx = this.dateSwiper?.swiper.clickedIndex;
        if (idx || idx === 0) {
          if (this.dates.filter(item => item.class.includes('_selected')).length > 1) {
            this.period = []
            this.dates.map(item => {
              if (item.class.includes('_weekend')) {
                item.class = '_weekend'
              } else {
                item.class = ''
              }
            })
          }
          let dateTo = null
          if (this.period[0] !== this.dates[idx].date) {
            this.period.push(this.dates[idx].date)
          } else {
            dateTo = this.dates[idx].date
          }
          this.dates[idx].class = '_selected';
          const parsedDates = this.period.map((date) => new Date(date as string).getTime());
          const minDate = new Date(Math.min(...parsedDates));
          const maxDate = new Date(Math.max(...parsedDates));
          const dateFrom = minDate.toISOString().slice(0, 10)

          if (this.period.length > 1) {
            dateTo = maxDate.toISOString().slice(0, 10)
            this.period = []
          }
          const queryParams = {
            ...this.activatedRoute.snapshot.queryParams, ['date_from']: dateFrom, ['date_to']: dateTo
          };
          if (dateTo === dateFrom) {
            this.period = []
          }

          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams,
            queryParamsHandling: 'merge'
          }).then();
        }
      },
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
          if (dateTo === dateForm) {
            this.dates[dateFromIndex].class = '_selected exact';
          }
        }
      }

      if (!dateForm) {
        this.period = [];
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

  ngOnDestroy() {
    this.activatedRouterSubscription?.unsubscribe();
  }
}



