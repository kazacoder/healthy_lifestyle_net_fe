import {Component, OnDestroy, OnInit} from '@angular/core';
import {NoteCard3Component} from '../../../../shared/components/cards/note-card3/note-card3.component';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../../shared/services/favorite.service';
import {MasterInfoType} from '../../../../../types/master-info.type';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-favorite-masters',
  imports: [
    NoteCard3Component,
    NgForOf
  ],
  standalone: true,
  templateUrl: './favorite-masters.component.html',
  styleUrl: './favorite-masters.component.scss'
})
export class FavoriteMastersComponent implements OnInit, OnDestroy {
  favoriteMasters: MasterInfoType[] = [];
  getFavoriteMasterSubscription: Subscription | null = null;

  constructor(private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,) {
  }

  ngOnInit() {
    this.getFavoriteEventList();
  }

  getFavoriteEventList() {
    this.getFavoriteMasterSubscription = this.favoriteService.getFavoriteMastersList().subscribe({
      next: (data: MasterInfoType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.favoriteMasters = data as MasterInfoType[];
        console.log(this.favoriteMasters);
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
    this.getFavoriteMasterSubscription?.unsubscribe();
  }

}
