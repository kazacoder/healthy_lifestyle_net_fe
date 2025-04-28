import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  protected readonly categories = categories;
}

const categories = [
  "Дыхание",
  "Цигун",
  "Йога",
  "Тантра",
  "Фестиваль",
  "Баня",
  "Семинар",
  "Танцы",
  "Спортивное мероприятие",
  "Мастер класс",
  "Шоу",
  "Общение",
  "Выставка",
  "Нейрографика",
  "Нетворкинг",
  "Игры",
  "Курсы",
  "Праздничное мероприятие",
  "Обучение",
  "Лекция",
  "Ретрит",
]
