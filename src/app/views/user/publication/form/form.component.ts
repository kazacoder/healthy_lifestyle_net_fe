import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../../shared/services/user.service';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryType} from '../../../../../types/category.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PublicationService} from '../../../../shared/services/publication.service';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';

@Component({
  selector: 'publication-form',
  imports: [
    NgIf,
    NgSelectComponent,
    ReactiveFormsModule,
    NgForOf
  ],
  standalone: true,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit, OnDestroy {
  isMaster: boolean = false;
  categories: CategoryType[] = [];
  getCategoriesSubscription: Subscription | null = null;

  publicationForm: any = this.fb.group({
    suit: [null, Validators.required],
    format: [null, Validators.required],
  })

  suitOpt = [
    {id: '1', title: 'Всем'},
    {id: '2', title: 'Только женщинам'},
    {id: '3', title: 'Только мужчинам'},
  ]

  formatOpt = [
    {id: '1', title: 'Онлайн'},
    {id: '2', title: 'Офлайн'},
    {id: '3', title: 'Комбинированный'},
  ]

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private publicationService: PublicationService,) {
    this.isMaster = this.userService.isMaster;
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

  addCategory(id: number) {
    console.log(id)
  }

  ngOnDestroy() {
    this.getCategoriesSubscription?.unsubscribe()
  }

}
