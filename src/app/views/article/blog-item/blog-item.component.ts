import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {
  EventCollectionHistoryComponent
} from '../../event/event-detail/event-collections/event-collection-history/event-collection-history.component';
import {EventCard3Component} from '../../../shared/components/cards/event-card3/event-card3.component';
import {NgClass, NgForOf} from '@angular/common';
import {SwiperNavComponent} from '../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {SwiperContainer} from 'swiper/element';
import {BlogCardComponent} from '../../../shared/components/cards/blog-card/blog-card.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {ArticleService} from '../../../shared/services/article.service';
import {ArticleType} from '../../../../types/article.type';
import {CommonUtils} from '../../../shared/utils/common-utils';

@Component({
  selector: 'blog-item',
  imports: [
    EventCollectionHistoryComponent,
    EventCard3Component,
    NgForOf,
    SwiperNavComponent,
    NgClass,
    BlogCardComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './blog-item.component.html',
  styleUrl: './blog-item.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BlogItemComponent implements AfterViewInit, OnInit, OnDestroy {
  protected readonly articles = articles;
  articleSwiper: SwiperContainer | null = null;
  articleSwiperParams = {
    slidesPerView: "auto",
    spaceBetween: 0,
    watchSlidesProgress: true,
    preventClicks :true,
    a11y: false,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    navigation: {
      nextEl: `.articles-swiper-similar .swiper-button-next`,
      prevEl: `.articles-swiper-similar .swiper-button-prev`,
    },
    breakpoints: {
      640: {

      },
    },
  }
  article: ArticleType | null = null;
  articleId: string | null | undefined = null;
  month: string= ''
  getArticleSubscription: Subscription | null = null;

  constructor(private activatedRoute: ActivatedRoute,
              private articleService: ArticleService,
              private _snackBar: MatSnackBar,) {
  }

  ngAfterViewInit(): void {
    this.articleSwiper = document.querySelector('.article-swiper-similar');
    if (this.articleSwiper) {
      Object.assign(this.articleSwiper, this.articleSwiperParams);
      this.articleSwiper.initialize();
    }
  }

  ngOnInit() {
    this.articleId = this.activatedRoute.snapshot.paramMap.get('url');
    if (this.articleId) {
      this.getArticleSubscription = this.articleService.getArticle(this.articleId).subscribe({
        next: (data: ArticleType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.article = data as ArticleType;
          this.month = CommonUtils.getRussianMonthName(this.article!.date, false);
          this.article.inner_images.forEach((image, index) => {
            this.article!.text = this.article!.text.replace('image_' + (index + 1), image.file)
          })
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка получения данных')
          }
        }
      });
    }
  }


  toggleFavorite() {
    console.log('todo')
  }

  ngOnDestroy() {
    this.getArticleSubscription?.unsubscribe();
  }
}


// ToDo remove after the Backend is ready
const articles = [
  {
    img: "blog.webp",
    favorite: true,
    text: 'Современное искусство, исследование города и монстр-желе: как «Якитория» удивляет своих гостей уже 24 года',
    type: 'Интервью',
    date: {day: '22', month: 'Июня'},
    tags: [{title: 'Йога', img: 'type-icon.svg'}, {title: 'Баня', img: 'type-icon2.svg'},],
  },
  {
    img: "blog2.webp",
    favorite: false,
    text: 'Современное искусство, исследование города и монстр-желе: как «Якитория» удивляет своих гостей уже 24 года',
    type: 'Интервью',
    date: {day: '22', month: 'Июня'},
    tags: [{title: 'Йога', img: 'type-icon.svg'}, {title: 'Баня', img: 'type-icon2.svg'},],
  },
  {
    img: "blog3.webp",
    favorite: false,
    text: 'Современное искусство, исследование города и монстр-желе: как «Якитория» удивляет своих гостей уже 24 года',
    type: 'Интервью',
    date: {day: '22', month: 'Июня'},
    tags: [{title: 'Йога', img: 'type-icon.svg'}, {title: 'Баня', img: 'type-icon2.svg'},],
  },
  {
    img: "blog4.webp",
    favorite: false,
    text: 'Современное искусство, исследование города и монстр-желе: как «Якитория» удивляет своих гостей уже 24 года',
    type: 'Интервью',
    date: {day: '22', month: 'Июня'},
    tags: [{title: 'Йога', img: 'type-icon.svg'}, {title: 'Баня', img: 'type-icon2.svg'},],
  },
  {
    img: "blog.webp",
    favorite: false,
    text: 'Современное искусство, исследование города и монстр-желе: как «Якитория» удивляет своих гостей уже 24 года',
    type: 'Интервью',
    date: {day: '22', month: 'Июня'},
    tags: [{title: 'Йога', img: 'type-icon.svg'}, {title: 'Баня', img: 'type-icon2.svg'},],
  },
]
