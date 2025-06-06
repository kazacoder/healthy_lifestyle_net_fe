import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EventQuestionItemComponent} from './event-question-item/event-question-item.component';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserService} from '../../../../shared/services/user.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'event-questions',
  imports: [
    EventQuestionItemComponent,
    FormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './event-questions.component.html',
  styleUrl: './event-questions.component.scss'
})
export class EventQuestionsComponent implements OnInit, OnDestroy {
  question: string = '';
  maxQuestionLength: number = 1000;
  minQuestionLength: number = 10;
  isLogged: boolean = false;
  isLoggedSubscription: Subscription | null = null;
  @Input() eventId: number | undefined | null = null;

  constructor(private userService: UserService,) {
  }

  ngOnInit() {
    this.isLoggedSubscription = this.userService.isLoggedObservable.subscribe(isLogged => {
      this.isLogged = isLogged;
    })
  }

  proceed() {
    console.log(this.question)
    console.log(this.eventId)
    console.log(this.isLogged)

  }

  ngOnDestroy() {
    this.isLoggedSubscription?.unsubscribe()
  }

}
