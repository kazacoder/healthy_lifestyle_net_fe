import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {MasterInfoType} from '../../../../../types/master-info.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../services/favorite.service';
import {Subscription} from 'rxjs';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'note-card3',
  imports: [
    NgClass,
    RouterLink
  ],
  standalone: true,
  templateUrl: './note-card3.component.html',
  styleUrl: './note-card3.component.scss'
})
export class NoteCard3Component implements OnDestroy {
  @Input() master: MasterInfoType | null = null;
  @Output() removeMasterFromFavoriteIndicator: EventEmitter<boolean> = new EventEmitter();
  toggleFavoriteMasterSubscription: Subscription | null = null;

  constructor(private _snackBar: MatSnackBar,
              private favoriteService: FavoriteService,) {
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
              this.removeMasterFromFavoriteIndicator.emit(true);
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
