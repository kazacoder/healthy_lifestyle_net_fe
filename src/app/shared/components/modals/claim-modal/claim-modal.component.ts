import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass, NgIf} from '@angular/common';
import {InfoModalComponent} from '../info-modal/info-modal.component';
import {WindowsUtils} from '../../../utils/windows-utils';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

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
export class ClaimModalComponent {
  @Input() isOpen: boolean = false;
  @Input() type: 'master' | 'event' | null = null;
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

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  constructor(private _snackBar: MatSnackBar,
              private fb: FormBuilder) {
  }

  closeModal() {
    this.isOpen = false;
    this.onCloseModal.emit(false)
    this.claimForm.reset();
  }

  proceed() {
    if (this.claimForm.valid) {

      //ToDO add sending request to BE
      this.toggleInfoModal(true);
      this.closeModal();
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
}
