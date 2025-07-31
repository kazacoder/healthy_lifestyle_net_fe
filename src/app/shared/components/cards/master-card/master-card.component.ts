import {Component, Input, OnDestroy } from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MasterInfoType} from '../../../../../types/master-info.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../services/favorite.service';
import {Subscription} from 'rxjs';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'master-card',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    NgIf,
    NgForOf
  ],
  templateUrl: './master-card.component.html',
  styleUrl: './master-card.component.scss'
})
export class MasterCardComponent implements OnDestroy {
  tagsOpen: boolean = false;
  toggleFavoriteMasterSubscription: Subscription | null = null;

  @Input() master: MasterInfoType | null = null;

  constructor(private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,) {
  }


  tagButtonProceed() {
    this.tagsOpen = !this.tagsOpen;
  }

  toggleFavorite() {
    if (this.master) {
      this.toggleFavoriteMasterSubscription = this.favoriteService.toggleFavoriteMaster(this.master.is_favorite, this.master.id)
        .subscribe({
          next: (data: MasterInfoType | null | DefaultResponseType) => {
            if (data) {
              if ((data as DefaultResponseType).detail !== undefined) {
                const error = (data as DefaultResponseType).detail;
                this._snackBar.open(error);
                throw new Error(error);
              }
              this.master = data as MasterInfoType;
            } else {
              this.master!.is_favorite = false;
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
    this.toggleFavoriteMasterSubscription?.unsubscribe();
  }
}

