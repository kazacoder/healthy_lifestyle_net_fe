import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {filter, Subscription} from 'rxjs';
import {CategoryType} from '../../../../types/category.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PublicationService} from '../../services/publication.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Settings} from '../../../../settings/settings';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit, OnDestroy{
  currentYear = new Date().getFullYear();
  categories: CategoryType[] = [];
  categoriesShowed: CategoryType[] = [];
  getCategoriesSubscription: Subscription | null = null;
  routerSubscription: Subscription | null = null;

  constructor(private publicationService: PublicationService,
              private _snackBar: MatSnackBar,
              private router: Router,) {
  }

  ngOnInit() {
    this.getCategoriesSubscription = this.publicationService.getCategoriesList().subscribe({
      next: (data: CategoryType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.categories = data as CategoryType[];
        this.cutTags();
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка получения данных')
        }
      }
    });

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.categories.length === this.categoriesShowed.length) {
          this.cutTags();
        }
      });
  }

  showAllTags() {
    this.categoriesShowed = this.categories
  }

  cutTags() {
    this.categoriesShowed = this.categories.slice(0, Settings.maxCategoryTagCount);
  }

  ngOnDestroy() {
    this.getCategoriesSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }
}


