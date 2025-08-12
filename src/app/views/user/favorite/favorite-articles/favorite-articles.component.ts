import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlogCardComponent} from '../../../../shared/components/cards/blog-card/blog-card.component';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../../shared/services/favorite.service';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {ArticleType} from '../../../../../types/article.type';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-favorite-articles',
  imports: [
    BlogCardComponent,
    NgForOf
  ],
  standalone: true,
  templateUrl: './favorite-articles.component.html',
  styleUrl: './favorite-articles.component.scss'
})
export class FavoriteArticlesComponent implements OnInit, OnDestroy {
  favoriteArticles: ArticleType[] = [];
  getFavoriteArticleSubscription: Subscription | null = null;

  constructor(private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,) {
  }

  ngOnInit() {
    this.getFavoriteArticleList();
  }

  getFavoriteArticleList() {
    this.getFavoriteArticleSubscription = this.favoriteService.getFavoriteArticleList().subscribe({
      next: (data: ArticleType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.favoriteArticles = data as ArticleType[];
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

  ngOnDestroy() {
    this.getFavoriteArticleSubscription?.unsubscribe();
  }
}
