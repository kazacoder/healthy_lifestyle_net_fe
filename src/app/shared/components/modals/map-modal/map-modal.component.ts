import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {MatSnackBar} from '@angular/material/snack-bar';

declare const ymaps: any;

@Component({
  selector: 'map-modal',
  imports: [
    NgIf,
    NgClass,
    CloseBtnMobComponent
  ],
  standalone: true,
  templateUrl: './map-modal.component.html',
  styleUrl: './map-modal.component.scss'
})
export class MapModalComponent implements AfterViewInit, OnChanges {
  @Input() isOpen = false;
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);
  @Output() selected = new EventEmitter<{ lat: number, lon: number }>();

  private map: any;
  private placeMark: any;
  private coords: { lat: number, lon: number } | null = null;

  constructor(private _snackBar: MatSnackBar) {

  }


  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.initMap();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      setTimeout(() => this.initMap(), 0);
    }
  }

  private initMap(): void {
    ymaps.ready(() => {
      this.map = new ymaps.Map('map', {
        center: [55.751244, 37.618423], // Москва по умолчанию
        zoom: 11
      });

      this.map.events.add('click', (e: any) => {
        const coords = e.get('coords');
        this.coords = { lat: coords[0], lon: coords[1] };

        if (this.placeMark) {
          this.placeMark.geometry.setCoordinates(coords);
        } else {
          this.placeMark = new ymaps.Placemark(coords, {}, { draggable: true });
          this.map.geoObjects.add(this.placeMark);
          this.placeMark.events.add('dragend', (ev: any) => {
            const newCoords = ev.get('target').geometry.getCoordinates();
            this.coords = { lat: newCoords[0], lon: newCoords[1] };
          });
        }
      });
    });
  }


  confirm() {
    if (this.coords) {
      this.selected.emit(this.coords);
      this.reset();
      // this.closeModal();
      return;
    }
    this._snackBar.open('Координаты не выбраны')
  }

  closeModal() {
    this.isOpen = false;
    this.map = null
    this.onCloseModal.emit(false)
  }

  private reset() {
    this.coords = null;
    if (this.placeMark) {
      this.map.geoObjects.remove(this.placeMark);
      this.placeMark = null;
    }
  }

}
