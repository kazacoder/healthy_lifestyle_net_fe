import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import AirDatepicker from 'air-datepicker';
import localeRu from 'air-datepicker/locale/ru'
import {NgClass} from '@angular/common';

@Component({
  selector: 'date-filter',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss'
})
export class DateFilterComponent implements OnInit {
  dateFilter: HTMLInputElement | null = null;
  @Output() onCalendarToggle = new EventEmitter<boolean>(false);
  calendarActive: boolean = false;

  // Closing dropdown calendar if click outside
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!document.querySelector('.date-filter')?.contains(event.target as Element) )  {
      this.calendarActive = false;
      this.onCalendarToggle.emit(this.calendarActive);
    }
  }

  ngOnInit(): void {
    this.dateFilter = document.querySelector('.date-input input');

    if (this.dateFilter) {
      new AirDatepicker(this.dateFilter, {
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
              let day = now.getDay();
              let difference = day === 0 ? 0 : 7 - day; // Если сегодня воскресенье, выбираем его
              weekend.setDate(now.getDate() + difference);
              dp.selectDate(weekend);
              dp.setViewDate(weekend);
            }
          },
          {
            content: 'Применить',
            attrs: {
              class: 'button-apply large'
            },
            onClick: (dp) => {
              // Здесь ваша логика для кнопки "Применить"
              console.log('Выбранная дата:', dp.selectedDates);
            }
          }
        ],
      });
    }
  }

  toggleCalendar() {
    this.calendarActive = !this.calendarActive;
    this.onCalendarToggle.emit(this.calendarActive);
    // let eventsBlock = document.querySelector(".events2")
    // if(eventsBlock && window.innerWidth > 992){
    //   document.body.scrollTop = document.documentElement.scrollTop = 400;
    // }
    // if(window.innerWidth <= 992){
    //   $(".m-page").toggleClass("fixed-body")
    //   $(".m-page").toggleClass("_open-calendar")
    // }
  }

}



