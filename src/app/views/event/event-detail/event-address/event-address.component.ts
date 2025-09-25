import {Component, Input, OnChanges} from '@angular/core';
import {CoordinatesType} from '../../../../../types/coordinates.type';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Settings} from '../../../../../settings/settings';

@Component({
  selector: 'event-address',
  imports: [],
  standalone: true,
  templateUrl: './event-address.component.html',
  styleUrl: './event-address.component.scss'
})
export class EventAddressComponent implements OnChanges {
  @Input() coordinates: CoordinatesType | null = null;
  @Input() address: string | null = '';
  mapUrl: SafeResourceUrl  | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    const url = `https://yandex.ru/map-widget/v1/?ll=
                 ${this.coordinates?.longitude}%2C${this.coordinates?.latitude}&z=
                 ${Settings.mapZoom}&pt=${this.coordinates?.longitude},${this.coordinates?.latitude},pm2vvm`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
