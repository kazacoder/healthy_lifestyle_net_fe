import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';

@Component({
  selector: 'city-modal',
  imports: [
    NgClass,
    CloseBtnMobComponent,
    NgForOf
  ],
  standalone: true,
  templateUrl: './city-modal.component.html',
  styleUrl: './city-modal.component.scss'
})
export class CityModalComponent implements OnInit {
  cities = cities;

  @Input()
  isOpened: boolean = false;
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  @Input()
  chosenCity: string | null = null;
  @Output() onChoiceCity: EventEmitter<string> = new EventEmitter();

  ngOnInit() {
    this.onCloseModal.emit(this.isOpened);
  }

  closeModal() {
    this.onCloseModal.emit(false);
    this.isOpened = false;
  }

  cityProceed(city: string) {
    this.onChoiceCity.emit(city);
    this.onCloseModal.emit(false);
    this.isOpened = false;
  }
}


const cities = [
  "Абакан",
  "Абдулино",
  "Абинск",
  "Агидель",
  "Агрыз",
  "Адыгейск",
  "Азнакаево",
  "Азов",
  "Ак-Довурак",
  "Аксай",
  "Алагир",
  "Алапаевск",
  "Алатырь",
  "Алдан",
  "Ак-Довурак",
  "Аксай",
  "Алагир",
  "Алапаевск",
  "Алатырь",
  "Алдан",
]
