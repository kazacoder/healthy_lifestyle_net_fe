import {Component, Input, OnChanges} from '@angular/core';
import {CoordinatesType} from '../../../../../types/coordinates.type';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'event-address',
  imports: [],
  standalone: true,
  templateUrl: './event-address.component.html',
  styleUrl: './event-address.component.scss'
})
export class EventAddressComponent implements OnChanges {
  @Input() coordinates: CoordinatesType | null = null;
  mapUrl: SafeResourceUrl  | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    const url = `https://yandex.ru/map-widget/v1/?ll=${this.coordinates?.longitude}%2C${this.coordinates?.latitude}&z=14&pt=${this.coordinates?.longitude},${this.coordinates?.latitude},pm2rdm`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
