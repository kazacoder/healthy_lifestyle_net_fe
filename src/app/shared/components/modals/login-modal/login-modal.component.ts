import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CloseBtnMobComponent} from '../../ui/close-btn-mob/close-btn-mob.component';
import {NgClass} from '@angular/common';
import {PassFieldComponent} from '../../ui/pass-field/pass-field.component';
import {environment} from '../../../../../environments/environment';
import {AuthService} from '../../../../core/auth/auth.service';

@Component({
  selector: 'login-modal',
  imports: [
    CloseBtnMobComponent,
    NgClass,
    PassFieldComponent
  ],
  standalone: true,
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  @Input()
  isOpen: boolean = true;

  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter(false);

  constructor(private authService: AuthService,) {
  }

  closeModal() {
    this.isOpen = false;
    this.onCloseModal.emit(false)
  }

  login() {
    this.authService.login().subscribe({
      next: (e) => {
        console.log('success');
        console.log(e);
      },
      error: (e) => {
        console.log('error');
        console.log(e);
      },
    })
    console.log(environment.api)
  }
}
