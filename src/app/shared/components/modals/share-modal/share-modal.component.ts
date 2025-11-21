import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass, NgIf} from '@angular/common';
import {PhoneFormatPipe} from '../../../pipes/phone-format.pipe';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'share-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass,
    NgIf,
    PhoneFormatPipe,
  ],
  standalone: true,
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.scss'
})
export class ShareModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Поделиться';
  @Input() url: string = '';

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  constructor(private clipboard: Clipboard,
              private _snackBar: MatSnackBar) {
  }

  closeModal() {
    this.isOpen = false;
    this.onCloseModal.emit(false)
  }

  copyToClipboard () {
    this.clipboard.copy(this.url);
    this._snackBar.open('Ссылка скопирована в буфер обмена');
    this.closeModal();
  }
}
