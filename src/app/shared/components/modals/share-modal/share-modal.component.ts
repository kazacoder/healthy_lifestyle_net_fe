import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass, NgIf} from '@angular/common';
import {PhoneFormatPipe} from '../../../pipes/phone-format.pipe';
import {ClipboardModule} from '@angular/cdk/clipboard';

@Component({
  selector: 'share-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass,
    NgIf,
    PhoneFormatPipe,
    ClipboardModule
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

  closeModal() {
    this.isOpen = false;
    this.onCloseModal.emit(false)
  }
}
