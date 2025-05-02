import {Component} from '@angular/core';
import {SortComponent} from '../../../shared/components/ui/sort/sort.component';
import {ParamFilterComponent} from '../../../shared/components/param-filter/param-filter.component';
import {BlogCardComponent} from '../../../shared/components/cards/blog-card/blog-card.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [
    SortComponent,
    ParamFilterComponent,
    BlogCardComponent,
    NgForOf
  ],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
  protected readonly articles = articles;
  protected readonly filterObjects = filterObjects;
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

const filterObjects: { title: string, options: string[], search: boolean, defaultOption?: string }[] = [
  {title: 'Формат', options: ['Формат 1', 'Формат 2'], search: false},
  {
    title: 'Категории',
    options: ['Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна', 'Баня', 'Сауна'],
    search: true
  },
]
