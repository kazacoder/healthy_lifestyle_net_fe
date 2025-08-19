import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {SwiperNavComponent} from '../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {SocialsComponent} from '../../../shared/components/ui/socials/socials.component';
import {EventCardComponent} from '../../../shared/components/cards/event-card/event-card.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SwiperContainer} from 'swiper/element/bundle';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MasterService} from '../../../shared/services/master.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MasterInfoType} from '../../../../types/master-info.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {ParagraphTextPipe} from '../../../shared/pipes/paragraph-text.pipe';
import {SocialObjectType} from '../../../../types/social-object.type';
import {CommonUtils} from '../../../shared/utils/common-utils';
import {FavoriteService} from '../../../shared/services/favorite.service';
import {AuthService} from '../../../core/auth/auth.service';
import {ClaimModalComponent} from "../../../shared/components/modals/claim-modal/claim-modal.component";
import {WindowsUtils} from '../../../shared/utils/windows-utils';

@Component({
  selector: 'app-master-detail',
    imports: [
        SwiperNavComponent,
        SocialsComponent,
        EventCardComponent,
        NgForOf,
        NgIf,
        ParagraphTextPipe,
        NgClass,
        ClaimModalComponent
    ],
  standalone: true,
  templateUrl: './master-detail.component.html',
  styleUrl: './master-detail.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MasterDetailComponent implements AfterViewInit, OnInit, OnDestroy {
  masterDetailSubscription: Subscription | null = null;
  toggleFavoriteMasterSubscription: Subscription | null = null;
  isLogged: boolean = false;
  isClaimModalOpen: boolean = false;
  isLoggedSubscription: Subscription | null = null;
  masterId: string | null | undefined = null;
  master: MasterInfoType | null = null;
  hideNavigation: boolean = false;
  socialObject: SocialObjectType | null = null
  masterSlider: SwiperContainer | null = null;
  specialityList: { speciality: string, experience: string }[] = []
  masterSliderParams = {
    slidesPerView: "auto",
    spaceBetween: 0,
    watchSlidesProgress: true,
    preventClicks: true,
    a11y: false,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    mousewheel: false,
    loop: true,
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

  constructor(private masterService: MasterService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,
              private authService: AuthService,) {
  }

  ngOnInit() {
    this.masterId = this.activatedRoute.snapshot.paramMap.get('url');
    this.isLoggedSubscription = this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.isLogged = isLogged;
      this.getMasterDetail();
    });
  }

  getMasterDetail() {
    if (this.masterId) {
      this.masterDetailSubscription = this.masterService.getMaster(this.masterId)
        .subscribe({
          next: (data: MasterInfoType | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            this.master = data as MasterInfoType
            this.master.specialities.forEach(item => {
              let experience;
              const experienceYears = new Date().getFullYear() - new Date(item.experience_since).getFullYear()
              if (experienceYears > 0) {
                experience = CommonUtils.formatPeriod(experienceYears)
              } else {
                const experienceMonth = new Date().getMonth() - new Date(item.experience_since).getMonth()
                if (experienceMonth > 0) {
                  experience = CommonUtils.formatPeriod(experienceMonth, 'month')
                } else {
                  experience = ''
                }
              }
              this.specialityList.push({speciality: item.speciality, experience: experience});
            })
            this.socialObject = {
              youtube: this.master.youtube,
              tg: this.master.telegram,
              vk: this.master.vk,
              instagram: this.master.instagram,
            }
            this.hideNavigation = (+!!this.master.photo + this.master.additional_images.length) < 2;
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              if (errorResponse.status === 404) {
                this.router.navigate(['404']).then()
              } else {
                this._snackBar.open(errorResponse.error.detail)
              }
            } else {
              this._snackBar.open('Ошибка получения данных')
            }
          }
        });
    }
  }

  ngAfterViewInit() {
    this.masterSlider = document.querySelector('.master-swiper');
    if (this.masterSlider) {
      Object.assign(this.masterSlider, this.masterSliderParams);
      this.masterSlider.initialize();
    }
  }

  toggleFavorite() {
    if (this.master) {
      this.toggleFavoriteMasterSubscription = this.favoriteService.toggleFavoriteMaster(this.master.is_favorite, this.master.id)
        .subscribe({
          next: (data: MasterInfoType | null | DefaultResponseType) => {
            if (data) {
              if ((data as DefaultResponseType).detail !== undefined) {
                const error = (data as DefaultResponseType).detail;
                this._snackBar.open(error);
                throw new Error(error);
              }
              this.master = data as MasterInfoType;
            } else {
              this.master!.is_favorite = false;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
            } else {
              this._snackBar.open('Ошибка обработки избранного')
            }
          }
        })
    }
  }

  toggleClaimModal(val: boolean) {
    this.isClaimModalOpen = val;
    WindowsUtils.fixBody(val);
  }

  ngOnDestroy() {
    this.masterDetailSubscription?.unsubscribe();
    this.toggleFavoriteMasterSubscription?.unsubscribe();
    this.isLoggedSubscription?.unsubscribe();
  }
}
