import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EventQuestionItemComponent} from './event-question-item/event-question-item.component';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserService} from '../../../../shared/services/user.service';
import {NgForOf, NgIf} from '@angular/common';
import {EventService} from '../../../../shared/services/event.service';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventQuestionResponseType} from '../../../../../types/event-question-response.type';
import {QuestionExtendedType} from '../../../../../types/question-extended.type';

@Component({
  selector: 'event-questions',
  imports: [
    EventQuestionItemComponent,
    FormsModule,
    NgIf,
    NgForOf
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
  createQuestionSubscription: Subscription | null = null;
  @Input() eventId: string | undefined | null = null;
  @Input() eventAuthor: number | undefined | null = null;

  constructor(private userService: UserService,
              private eventService: EventService,
              private _snackBar: MatSnackBar,) {

  }

  ngOnInit() {
    this.isLoggedSubscription = this.userService.isLoggedObservable.subscribe(isLogged => {
      this.isLogged = isLogged;
    })
    this.getEventQuestionResponse();
  }

  getEventQuestionResponse () {
    if (this.eventId) {
      this.answersSubscription = this.eventService.getQuestionsWithAnswers(this.eventId).subscribe({
        next: (data: EventQuestionResponseType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.questionResponse = data as EventQuestionResponseType;
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
    if (this.eventId) {
      this.createQuestionSubscription = this.eventService.createQuestion(this.eventId, this.question).subscribe({
        next: (data: QuestionExtendedType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this._snackBar.open('Ваш вопрос успешно отправлен');
          this.question = '';
          this.getEventQuestionResponse();
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка отправки вопроса')
          }
        }
      })
    }
  }

  ngOnDestroy() {
    this.isLoggedSubscription?.unsubscribe()
    this.createQuestionSubscription?.unsubscribe()
    this.answersSubscription?.unsubscribe()
  }
}
