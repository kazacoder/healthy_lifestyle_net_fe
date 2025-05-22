import { Component } from '@angular/core';
import {UploadComponent} from './upload/upload.component';
import {PublicationFormComponent} from './form/publication-form.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'publication',
  imports: [
    PublicationFormComponent,
    UploadComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.scss'
})
export class PublicationComponent {

}
