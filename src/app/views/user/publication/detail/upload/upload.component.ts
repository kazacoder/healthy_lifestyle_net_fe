import { Component } from '@angular/core';
import {UploadItemComponent} from './upload-item/upload-item.component';

@Component({
  selector: 'publication-upload',
  imports: [
    UploadItemComponent
  ],
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

}
