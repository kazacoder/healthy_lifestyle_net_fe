import {Component, OnDestroy, OnInit} from '@angular/core';
import {SortComponent} from '../../../shared/components/ui/sort/sort.component';
import {ParamFilterComponent} from '../../../shared/components/param-filter/param-filter.component';
import {BlogCardComponent} from '../../../shared/components/cards/blog-card/blog-card.component';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FilterObjectType} from '../../../../types/filter-object.type';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ArticleType} from '../../../../types/article.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../../core/auth/auth.service';
import {ArticleService} from '../../../shared/services/article.service';
import {ParamsObjectType} from '../../../../types/params-object.type';
import {Settings} from '../../../../settings/settings';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {ArticleResponseType} from '../../../../types/article-response.type';
import {FiltersDataTypeArticles} from '../../../../types/filters-data.type';

@Component({
  selector: 'app-blog',
  imports: [
    SortComponent,
    ParamFilterComponent,
    BlogCardComponent,
    NgForOf,
    NgStyle,
    NgClass,
    NgIf
  ],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit, OnDestroy {
  articles: ArticleType[] = [];
  filterObjects: FilterObjectType[] = [];
  offset: number = 0;
  filtersSelected: boolean = false;
  params: ParamsObjectType | null = null;
  showMoreButton: boolean = false;
  activatedRouterSubscription: Subscription | null = null;
  getArticlesSubscription: Subscription | null = null;
  getFiltersSubscription: Subscription | null = null;
  isLoggedSubscription: Subscription | null = null;


  constructor(private articleService: ArticleService,
              private _snackBar: MatSnackBar,
              private activateRoute: ActivatedRoute,
              private authService: AuthService,) {
  }

  ngOnInit() {
    this.getFiltersResponse();

    this.activatedRouterSubscription = this.activateRoute.queryParams.subscribe(params => {
      this.params = params;
      this.filtersSelected = Object.keys(params).length > 1 || (Object.keys(params).length === 1 &&  Object.keys(params)[0] !== 'ordering');
      this.getArticlesResponse();
    })
  }

  getArticlesResponse(offset: number = 0) {
    this.getArticlesSubscription = this.articleService.getArticlesList(Settings.articlesDefaultLimit, offset, this.params).subscribe({
      next: (data: ArticleResponseType | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        const eventResponse = data as ArticleResponseType

        if (offset > 0 && eventResponse) {
          this.articles = Array.prototype.concat(this.articles, eventResponse.results);
        } else {
          this.articles = eventResponse.results;
        }

        this.showMoreButton = eventResponse.count > this.articles.length;
        this.offset = this.articles.length;
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных')
        }
      }
    })
  }

  getFiltersResponse() {
    this.getFiltersSubscription = this.articleService.getFiltersData().subscribe({
      next: (data: FiltersDataTypeArticles | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        const filters = data as FiltersDataTypeArticles
        this.filterObjects.push({title: 'Тип', name: 'types', options: filters.types, search: false});
        this.filterObjects.push({title: 'Категории', name: 'categories', options: filters.categories, search: true, multi: true});
        },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных фильтов')
        }
      }
    });
  }

  ngOnDestroy() {
    this.activatedRouterSubscription?.unsubscribe();
  }
}

