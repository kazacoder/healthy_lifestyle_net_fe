import {Component, EventEmitter, HostListener, OnDestroy, OnInit, Output} from '@angular/core';
import AirDatepicker from 'air-datepicker';
import localeRu from 'air-datepicker/locale/ru'
import {CommonModule, DatePipe, NgClass} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'date-filter',
  standalone: true,
  imports: [
    NgClass,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss'
})
export class DateFilterComponent implements OnInit, OnDestroy {
  dateFilter: HTMLInputElement | null = null;
  @Output() onCalendarToggle = new EventEmitter<boolean>(false);
  calendarActive: boolean = false;
  activatedRouterSubscription: Subscription | null = null;
  datePicker: AirDatepicker | null = null;

  // Closing dropdown calendar if click outside
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!document.querySelector('.date-filter')?.contains(event.target as Element) )  {
      this.calendarActive = false;
      this.onCalendarToggle.emit(this.calendarActive);
    }
  }

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private datePipe: DatePipe,) {
  }


  ngOnInit(): void {
    this.dateFilter = document.querySelector('.date-input input');

    if (this.dateFilter) {
      this.datePicker = new AirDatepicker(this.dateFilter, {
        locale: localeRu,
        autoClose: true,
        inline: true,
        range: true,
        // selectedDates: [new Date()],
        onSelect: () => {
          document.querySelector(".date-input")?.classList.add("input-active")
        },
        buttons: [
          {
            content: 'Сегодня',
            attrs: {
              class: 'datepicker-button'
            },
            // ToDO ANY!!!!!
            onClick: (dp: any) => {
              let today = new Date();
              dp.selectDate(today);
              dp.selectDate(today);
              dp.setViewDate(today);
            }
          },
          {
            content: 'Завтра',
            attrs: {
              class: 'datepicker-button'
            },
            onClick: (dp: any) => {
              let tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              dp.selectDate(tomorrow);
              dp.selectDate(tomorrow);
              dp.setViewDate(tomorrow);
            }
          },
          {
            content: 'В выходные',
            attrs: {
              class: 'datepicker-button'
            },
            onClick: (dp: any) => {
              let now = new Date();
              let weekend = new Date();
              let saturday = new Date();
              let day = now.getDay();
              let difference = day === 0 ? 0 : 7 - day; // Если сегодня воскресенье, выбираем его
              weekend.setDate(now.getDate() + difference);
              saturday.setDate(now.getDate() + difference - 1);
              dp.selectDate(saturday);
              dp.selectDate(weekend);
              // dp.setViewDate(weekend);
            }
          },
          {
            content: 'Применить',
            attrs: {
              class: 'button-apply large'
            },
            onClick: (dp) => {
              const dateFrom = this.datePipe.transform(dp.selectedDates[0], 'yyyy-MM-dd');
              const dateTo = this.datePipe.transform(dp.selectedDates[1], 'yyyy-MM-dd');
              const queryParams = {
                ...this.activatedRoute.snapshot.queryParams, ['date_from']: dateFrom, ['date_to']: dateTo
              };

              this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams,
                queryParamsHandling: 'merge'
              }).then();
              this.toggleCalendar();
            }
          }
        ],
      });

      this.activatedRouterSubscription = this.activatedRoute.queryParams.subscribe(params => {
        const dateForm = params['date_from']
        const dateTo = params['date_to']
        this.datePicker?.clear()

        if (dateForm) {
            this.datePicker?.selectDate(dateForm)
          if (dateTo) {
            this.datePicker?.selectDate(dateTo)
          }
        }
      });
    }
  }

  toggleCalendar() {
    this.calendarActive = !this.calendarActive;
    this.onCalendarToggle.emit(this.calendarActive);
    let eventsBlock = document.querySelector(".events2")
    if(eventsBlock && window.innerWidth > 992 && this.calendarActive){
      document.body.scrollTop = document.documentElement.scrollTop = 400;
    }
    if(window.innerWidth <= 992){
      document.querySelector(".m-page")?.classList.toggle("fixed-body")
      document.querySelector(".m-page")?.classList.toggle("open-calendar")
    }
  }

  ngOnDestroy() {
    this.activatedRouterSubscription?.unsubscribe();
  }
}



