import {Component, OnDestroy, OnInit} from '@angular/core';
import {UploadComponent} from './upload/upload.component';
import {PublicationFormComponent} from './form/publication-form.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {AdditionalImageType, PublicationType} from '../../../../../types/publication.type';
import {Subscription} from 'rxjs';
import {PublicationService} from '../../../../shared/services/publication.service';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'publication',
  imports: [
    PublicationFormComponent,
    UploadComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.scss'
})
export class PublicationComponent implements OnInit, OnDestroy {

  publicationId: string | null = null;
  publicationTitle = 'Разместить мероприятие'
  imageForm: FormGroup | null = null;
  imagesChanged: { main: boolean, additional: boolean } = { main: false, additional: false };
  currentPublication: PublicationType | null = null;
  currentPublicationImages: {mainImage: string, additionalImages: AdditionalImageType[]} | null = null;
  getCurrentPublicationSubscription: Subscription | null = null;

  constructor(private activatedRoute: ActivatedRoute,
              private publicationService: PublicationService,
              private _snackBar: MatSnackBar,
              private router: Router) {

  }

  ngOnInit() {
    this.publicationId = this.activatedRoute.snapshot.paramMap.get('url');
    if (this.publicationId) {
      this.publicationTitle = 'Редактировать мероприятие'
      this.getCurrentPublicationSubscription = this.publicationService.getPublication(this.publicationId).subscribe({
        next: (data: PublicationType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.currentPublication = data as PublicationType;
          this.currentPublicationImages = {
            mainImage: this.currentPublication.image,
            additionalImages: this.currentPublication.additional_images
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            if (errorResponse.status === 404) {
              this.router.navigate(['404']).then();
            }
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка получения данных')
          }
        }
      })
    }
  }

  updateImageForm(data: [FormGroup, { main: boolean, additional: boolean }]) {
    this.imageForm = data[0];
    this.imagesChanged = data[1]
  }

  ngOnDestroy() {
    this.getCurrentPublicationSubscription?.unsubscribe();
  }
}
