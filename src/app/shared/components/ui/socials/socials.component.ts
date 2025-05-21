import {Component, Input} from '@angular/core';
import {SocialObjectType} from '../../../../../types/social-object.type';
import {NgIf} from '@angular/common';

@Component({
  selector: 'socials',
  imports: [
    NgIf
  ],
  standalone: true,
  templateUrl: './socials.component.html',
  styleUrl: './socials.component.scss'
})
export class SocialsComponent {
  @Input()
  socialObject: SocialObjectType | null = null
}
