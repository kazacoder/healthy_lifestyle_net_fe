import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'user-settings',
  imports: [
    NgIf
  ],
  standalone: true,
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {

}
