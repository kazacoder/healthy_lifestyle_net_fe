import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {
  EventCollectionHistoryComponent
} from '../../event/event-detail/event-collections/event-collection-history/event-collection-history.component';
import {EventCard3Component} from '../../../shared/components/cards/event-card3/event-card3.component';
import {NgClass, NgForOf} from '@angular/common';
import {SwiperNavComponent} from '../../../shared/components/ui/swiper-nav/swiper-nav.component';
import {SwiperContainer} from 'swiper/element';
import {BlogCardComponent} from '../../../shared/components/cards/blog-card/blog-card.component';

@Component({
  selector: 'blog-item',
  imports: [
    EventCollectionHistoryComponent,
    EventCard3Component,
    NgForOf,
    SwiperNavComponent,
    NgClass,
    BlogCardComponent
  ],
  standalone: true,
  templateUrl: './blog-item.component.html',
  styleUrl: './blog-item.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BlogItemComponent implements AfterViewInit{
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

  ngAfterViewInit(): void {
    this.articleSwiper = document.querySelector('.article-swiper-similar');
    if (this.articleSwiper) {
      Object.assign(this.articleSwiper, this.articleSwiperParams);
      this.articleSwiper.initialize();
    }
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
