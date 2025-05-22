import { Component } from '@angular/core';
import {FormComponent} from './form/form.component';
import {UploadComponent} from './upload/upload.component';

@Component({
  selector: 'publication',
  imports: [
    FormComponent,
    UploadComponent
  ],
  standalone: true,
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.scss'
})
export class PublicationComponent {

}
