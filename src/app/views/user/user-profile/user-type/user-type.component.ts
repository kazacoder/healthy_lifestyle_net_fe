import { Component } from '@angular/core';
import {SpinnerComponent} from '../../../../shared/components/ui/spinner/spinner.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'user-type',
  imports: [
    SpinnerComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './user-type.component.html',
  styleUrl: './user-type.component.scss'
})
export class UserTypeComponent {

}
