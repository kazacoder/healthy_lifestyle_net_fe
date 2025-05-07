import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'user-form',
  imports: [
    NgIf
  ],
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {

}
