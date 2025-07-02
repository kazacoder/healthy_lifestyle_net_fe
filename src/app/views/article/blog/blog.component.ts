import {Component, OnDestroy, OnInit} from '@angular/core';
import {SortComponent} from '../../../shared/components/ui/sort/sort.component';
import {ParamFilterComponent} from '../../../shared/components/param-filter/param-filter.component';
import {BlogCardComponent} from '../../../shared/components/cards/blog-card/blog-card.component';
import {NgClass, NgForOf, NgStyle} from '@angular/common';
import {FilterObjectType} from '../../../../types/filter-object.type';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-blog',
  imports: [
    SortComponent,
    ParamFilterComponent,
    BlogCardComponent,
    NgForOf,
    NgStyle,
    NgClass
  ],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit, OnDestroy {
  protected readonly articles = articles;
  protected readonly filterObjects = filterObjects;
  filtersSelected: boolean = false;
  activatedRouterSubscription: Subscription | null = null;

  constructor(private activateRoute: ActivatedRoute,) {
  }

  ngOnInit() {
    this.activatedRouterSubscription = this.activateRoute.queryParams.subscribe(params => {
      this.filtersSelected = Object.keys(params).length > 0;
    })
  }

  ngOnDestroy() {
    this.activatedRouterSubscription?.unsubscribe();
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
  {
    img: "blog2.webp",
    favorite: false,
    text: 'Современное искусство, исследование города и монстр-желе: как «Якитория» удивляет своих гостей уже 24 года',
    type: 'Интервью',
    date: {day: '22', month: 'Июня'},
    tags: [{title: 'Йога', img: 'type-icon.svg'}, {title: 'Баня', img: 'type-icon2.svg'},],
  }, {
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
  }
]

const filterObjects: FilterObjectType[] = [
  {title: 'Формат', name: 'formats', options: [{id: 1, title: 'Формат 1'}, {id: 2, title: 'Формат 2'}], search: false},
  {
    title: 'Категории',
    name: 'categories',
    options: [{id: 1, title: 'Баня'}, {id: 2, title: 'Сауна'}],
    search: true
  },
]
