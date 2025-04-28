import {Component, Input} from '@angular/core';

@Component({
  selector: 'pass-field',
  imports: [],
  standalone: true,
  templateUrl: './pass-field.component.html',
  styleUrl: './pass-field.component.scss'
})
export class PassFieldComponent {
  @Input()
  label: string = '';
  placeholder: string = '';

}
