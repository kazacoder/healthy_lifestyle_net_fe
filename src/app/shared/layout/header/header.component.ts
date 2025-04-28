import { Component } from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {LoginModalComponent} from "../../components/modals/login-modal/login-modal.component";
import {WindowsUtils} from '../../utils/windows-utils';

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        NgIf,
        NgOptimizedImage,
        RouterLink,
        RouterLinkActive,
        LoginModalComponent
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isOpenLoginModal: boolean = false;

  toggleLoginModal(value: boolean) {
    this.isOpenLoginModal = value;
    WindowsUtils.fixBody(value);
  }

}
