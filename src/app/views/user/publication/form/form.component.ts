import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../shared/services/user.service';
import {NgIf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'publication-form',
  imports: [
    NgIf,
    NgSelectComponent,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  isMaster: boolean = false;

  publicationForm: any = this.fb.group({
    suit: [null, Validators.required],
    format: [null, Validators.required],
  })

  suitOpt = [
    {id: '1', title: 'Всем'},
    {id: '2', title: 'Только женщинам'},
    {id: '3', title: 'Только мужчинам'},
  ]

  formatOpt = [
    {id: '1', title: 'Онлайн'},
    {id: '2', title: 'Офлайн'},
    {id: '3', title: 'Комбинированный'},
  ]

  constructor(private userService: UserService,
              private fb: FormBuilder,) {
    this.isMaster = this.userService.isMaster;
  }

  ngOnInit() {
  }

}
