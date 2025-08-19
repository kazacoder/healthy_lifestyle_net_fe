import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass, NgIf} from '@angular/common';
import {InfoModalComponent} from '../info-modal/info-modal.component';
import {WindowsUtils} from '../../../utils/windows-utils';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {ClaimService} from '../../../services/claim.service';
import {ClaimResponseType} from '../../../../../types/claim-response.type';

@Component({
  selector: 'claim-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass,
    InfoModalComponent,
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './claim-modal.component.html',
  styleUrl: './claim-modal.component.scss'
})
export class ClaimModalComponent implements OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() type: 'master' | 'event' | null = null;
  @Input() id: string | null = null;
  types = {
    master: {title: 'Пожаловаться на мастера', label: 'Текст жалобы'},
    event: {title: 'Пожаловаться на мероприятие', label: 'Текст жалобы'},
  }
  isInfoModalOpen: boolean = false;
  infoModalLabel = 'Жалоба отправлена';
  infoModalText = 'Мы рассмотрим вашу жалобу <br> и примем меры, о которых сообщим в уведомлении, спасибо';
  maxClaimLength = 1000;
  claimForm = this.fb.group({
    claimText: ['', [Validators.required, Validators.maxLength(this.maxClaimLength)]],
  })
  createClaimSubscription: Subscription | null = null;

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  constructor(private _snackBar: MatSnackBar,
              private fb: FormBuilder,
              private claimService: ClaimService,) {
  }

  closeModal() {
    this.isOpen = false;
    this.onCloseModal.emit(false)
    this.claimForm.reset();
  }

  proceed() {
    if (this.claimForm.valid && this.type && this.id) {
      this.createClaimSubscription = this.claimService.createClaim(this.id, this.type, this.claimForm.value.claimText!).subscribe({
        next: (data: ClaimResponseType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.toggleInfoModal(true);
          this.closeModal();
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка сохранения ответа')
          }
        }
      });
    }
  }

  toggleInfoModal(val: boolean) {
    this.isInfoModalOpen = val;
    WindowsUtils.fixBody(val);
  }


  get label(): string | null {
    return this.type ? this.types[this.type].label : null;
  }

  get title(): string | null {
    return this.type ? this.types[this.type].title : null;
  }

  ngOnDestroy() {
    this.createClaimSubscription?.unsubscribe();
  }
}
