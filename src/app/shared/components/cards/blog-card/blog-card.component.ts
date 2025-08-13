import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ArticleType} from '../../../../../types/article.type';
import {CommonUtils} from '../../../utils/common-utils';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../services/favorite.service';

@Component({
  selector: 'blog-card',
  imports: [
    NgForOf,
    NgClass,
    RouterLink,
    NgIf
  ],
  standalone: true,
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss'
})
export class BlogCardComponent implements OnInit, OnDestroy {
  @Input() article: ArticleType | null = null;
  @Output() removeArticleFromFavoriteIndicator: EventEmitter<boolean> = new EventEmitter();
  @Input() isLogged: boolean = false;
  month: string = '';
  toggleFavoriteArticleSubscription: Subscription | null = null;

  constructor(private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,) {
  }

  ngOnInit() {
    this.month = CommonUtils.getRussianMonthName(this.article!.date);
  }

  toggleFavorite() {
    if (this.article) {
      this.toggleFavoriteArticleSubscription = this.favoriteService.toggleFavoriteEventArticle(this.article.is_favorite, this.article.id)
        .subscribe({
          next: (data: ArticleType | null | DefaultResponseType) => {
            if (data) {
              if ((data as DefaultResponseType).detail !== undefined) {
                const error = (data as DefaultResponseType).detail;
                this._snackBar.open(error);
                throw new Error(error);
              }
              this.article = data as ArticleType;
            } else {
              this.article!.is_favorite = false;
              this.removeArticleFromFavoriteIndicator.emit(true);
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

  ngOnDestroy() {
    this.toggleFavoriteArticleSubscription?.unsubscribe();
  }
}
