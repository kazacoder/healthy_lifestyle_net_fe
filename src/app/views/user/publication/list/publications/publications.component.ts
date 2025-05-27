import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
  PublicationCardComponent
} from '../../../../../shared/components/cards/publication-card/publication-card.component';
import {DefaultResponseType} from '../../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PublicationService} from '../../../../../shared/services/publication.service';
import {Subscription} from 'rxjs';
import {PublicationType} from '../../../../../../types/publication.type';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-publications',
  imports: [
    RouterLink,
    PublicationCardComponent,
    NgForOf
  ],
  standalone: true,
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.scss'
})
export class PublicationsComponent implements OnInit, OnDestroy {

  getEventsListSubscription: Subscription | null = null;
  publications: PublicationType[] = [];


  constructor(private _snackBar: MatSnackBar,
              private publicationService: PublicationService,) {

  }

  ngOnInit() {
    this.getEventsListSubscription = this.publicationService.getPublicationsList().subscribe({
      next: (data: PublicationType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.publications = data as PublicationType[];
        console.log(this.publications);
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

  ngOnDestroy() {
    this.getEventsListSubscription?.unsubscribe();
  }

}
