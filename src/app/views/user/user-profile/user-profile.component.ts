import { Component } from '@angular/core';
import {ProfileNavComponent} from './profile-nav/profile-nav.component';
import {ImgFieldComponent} from './img-field/img-field.component';
import {UserTypeComponent} from './user-type/user-type.component';
import {UserSettingsComponent} from './user-settings/user-settings.component';
import {UserFormComponent} from './user-form/user-form.component';


@Component({
  selector: 'app-user-profile',
  imports: [
    ProfileNavComponent,
    ImgFieldComponent,
    UserTypeComponent,
    UserSettingsComponent,
    UserFormComponent
  ],
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

}
