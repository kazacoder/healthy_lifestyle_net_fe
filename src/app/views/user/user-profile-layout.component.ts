import { Component } from '@angular/core';
import {ProfileNavComponent} from './user-profile/profile-nav/profile-nav.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'user-profile-layout',
  imports: [
    ProfileNavComponent,
    RouterOutlet
  ],
  standalone: true,
  templateUrl: './user-profile-layout.component.html',
  styleUrl: './user-profile-layout.component.scss'
})
export class UserProfileLayoutComponent {

}
