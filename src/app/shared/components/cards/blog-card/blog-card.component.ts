import {Component, Input, OnInit} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ArticleType} from '../../../../../types/article.type';
import {CommonUtils} from '../../../utils/common-utils';

@Component({
  selector: 'blog-card',
  imports: [
    NgForOf,
    NgClass,
    RouterLink
  ],
  standalone: true,
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss'
})
export class BlogCardComponent implements OnInit {
  @Input() article: ArticleType | null = null;
  month: string = '';
  @Input() favorite: boolean = false;

  ngOnInit() {
    this.month = CommonUtils.getRussianMonthName(this.article!.date);
  }

  toggleFavorite() {
    this.favorite = !this.favorite;
  }
}
