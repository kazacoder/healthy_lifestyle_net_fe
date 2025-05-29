import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PublicationType} from '../../../../../types/publication.type';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {CommonUtils} from '../../../utils/common-utils';
import {RouterLink} from '@angular/router';
import {ConfirmModalComponent} from '../../modals/confirm-modal/confirm-modal.component';
import {WindowsUtils} from '../../../utils/windows-utils';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {PublicationService} from '../../../services/publication.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'publication-card',
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    ConfirmModalComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './publication-card.component.html',
  styleUrl: './publication-card.component.scss'
})
export class PublicationCardComponent implements OnInit, OnDestroy {
  @Input()
  publication: PublicationType | null = null;
  @Output() deletedPublicationId = new EventEmitter<number>();

  day = 0;
  month = '';
  tickets = ''
  isOpenConfirmModal: boolean = false
  removePublicationSubscription: Subscription | null = null;

  constructor(private publicationService: PublicationService,
              private _snackBar: MatSnackBar,) {
  }

  ngOnInit(): void {
    this.day = new Date(this.publication!.date).getDate();
    this.month = CommonUtils.getRussianMonthName(this.publication!.date);
    this.tickets = CommonUtils.getTicketWord(this.publication!.ticket_amount)
  }

  toggleDeleteModal(val: boolean) {
    this.isOpenConfirmModal = val;
    WindowsUtils.fixBody(val);
  }

  deletePublication(id: number | undefined) {
    if (id) {
      this.removePublicationSubscription = this.publicationService.removePublication(id).subscribe({
        next: (data: null | DefaultResponseType) => {
          if (data && (data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this._snackBar.open('Событие удалено');
          this.deletedPublicationId.emit(id);
          this.toggleDeleteModal(false);
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка удаления события')
          }
        }
      })
    }
  }

  ngOnDestroy() {
    this.removePublicationSubscription?.unsubscribe()
  }
}
