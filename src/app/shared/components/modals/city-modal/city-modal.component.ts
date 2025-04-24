import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';

@Component({
  selector: 'city-modal',
  imports: [
    NgClass,
    CloseBtnMobComponent
  ],
  standalone: true,
  templateUrl: './city-modal.component.html',
  styleUrl: './city-modal.component.scss'
})
export class CityModalComponent implements OnInit {
  @Input()
  isOpened: boolean = false;

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  ngOnInit() {
    this.onCloseModal.emit(this.isOpened);
  }

  closeModal() {
    this.onCloseModal.emit(false);
    this.isOpened = false;
  }
}
