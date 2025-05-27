import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'publication-upload-item',
  imports: [
    NgIf
  ],
  standalone: true,
  templateUrl: './upload-item.component.html',
  styleUrl: './upload-item.component.scss'
})
export class UploadItemComponent {
  @Input()
  imagePreview: string | ArrayBuffer | null = null;

  @Input()
  fileName: string = '';

  @Output()
  onImageRemove: EventEmitter<any> = new EventEmitter();

  removeImage() {
    this.imagePreview = null;
    this.onImageRemove.emit(this.fileName);
  }
}
