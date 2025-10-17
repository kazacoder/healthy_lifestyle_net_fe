import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, OnDestroy} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SwiperNavComponent} from '../../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {SwiperContainer} from 'swiper/element/bundle';
import {AdditionalImageType} from '../../../../../types/additional-image.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventService} from '../../../../shared/services/event.service';
import {Subscription} from 'rxjs';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {BookingResponseType} from '../../../../../types/booking-response.type';
import {PhoneFormatPipe} from '../../../../shared/pipes/phone-format.pipe';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'event-desc',
  imports: [
    NgIf,
    SwiperNavComponent,
    NgForOf,
    NgClass,
    PhoneFormatPipe
  ],
  standalone: true,
  templateUrl: './event-desc.component.html',
  styleUrl: './event-desc.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventDescComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() placesBooked: number = 0;
  @Input() eventId: string | null | undefined = null;
  @Input() isLogged: boolean = false;
  @Input() description: string | undefined = '';
  @Input() tg: string | undefined | null = '';
  @Input() whatsapp: string | undefined | null = '';
  @Input() photos: AdditionalImageType[] | null | undefined = undefined;
  photoSwiper: SwiperContainer | null = null;
  hideNavigation: boolean = false;
  waUrl: SafeResourceUrl | null = null;
  tgUrl: SafeResourceUrl | null = null;
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

  bookingSubscription: Subscription | null = null;

  constructor(private _snackBar: MatSnackBar,
              private eventService: EventService,
              private sanitizer: DomSanitizer) {
  }

  ngOnChanges() {
    this.hideNavigation = !this.photos || this.photos.length === 0;
    this.waUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://wa.me/7${ this.whatsapp }`)
    this.tgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://t.me/${ this.tg }`)
  }

  ngAfterViewInit(): void {
    this.photoSwiper = document.querySelector('.event-swiper-photo');
    if (this.photoSwiper) {
      Object.assign(this.photoSwiper, this.photoSwiperParams);
      this.photoSwiper.initialize();
    }
  }

  book() {
    if (!this.isLogged) {
      this._snackBar.open('Чтобы забронировать мероприятие необходимо войти');
      return;
    }
    if (this.eventId) {
      this.bookingSubscription = this.eventService.bookEvent(this.eventId).subscribe({
        next: (data: BookingResponseType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.placesBooked = (data as BookingResponseType).places;
          this._snackBar.open('Забронировано успешно')
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка бронирования мероприятия')
          }
        }
      })
    }
  }

  ngOnDestroy() {
    this.bookingSubscription?.unsubscribe();
  }
}
