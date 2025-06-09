import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EventQuestionItemComponent} from './event-question-item/event-question-item.component';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserService} from '../../../../shared/services/user.service';
import {NgIf} from '@angular/common';
import {EventService} from '../../../../shared/services/event.service';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventQuestionResponseType} from '../../../../../types/event-question-response.type';

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
  questionResponse: EventQuestionResponseType | null = null;
  answersSubscription: Subscription | null = null;
  @Input() eventId: string | undefined | null = null;

  constructor(private userService: UserService,
              private eventService: EventService,
              private _snackBar: MatSnackBar,) {

  }

  ngOnInit() {
    this.isLoggedSubscription = this.userService.isLoggedObservable.subscribe(isLogged => {
      this.isLogged = isLogged;
    })

    console.log(this.eventId)

    if (this.eventId) {
      this.answersSubscription = this.eventService.getQuestionsWithAnswers(this.eventId).subscribe({
        next: (data: EventQuestionResponseType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.questionResponse = data as EventQuestionResponseType;
          console.log(this.questionResponse);
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка получения данных')
          }
        }
      })
    }



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
