import {Component, Input, OnInit} from '@angular/core';
import {NgOptimizedImage, NgStyle} from '@angular/common';

@Component({
  selector: 'img-field',
  imports: [
    NgOptimizedImage,
    NgStyle
  ],
  standalone: true,
  templateUrl: './img-field.component.html',
  styleUrl: './img-field.component.scss'
})
export class ImgFieldComponent implements OnInit {
  @Input()
  userPhotoUrl: string | null  = null;

  userPhoto: string = 'assets/img/img.svg'

  ngOnInit() {
    if (this.userPhotoUrl) {
      this.userPhoto = this.userPhotoUrl
    }
  }
}
