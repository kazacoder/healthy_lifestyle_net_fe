import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuestionExtendedType} from '../../../../../../types/question-extended.type';
import {DatePipe, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DefaultResponseType} from '../../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {EventService} from '../../../../../shared/services/event.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AnswerResponseType} from '../../../../../../types/answer-response.type';
import {UserService} from '../../../../../shared/services/user.service';

@Component({
  selector: 'event-question-item',
  imports: [
    NgIf,
    DatePipe,
    ReactiveFormsModule,
    FormsModule
  ],
  standalone: true,
  templateUrl: './event-question-item.component.html',
  styleUrl: './event-question-item.component.scss'
})
export class EventQuestionItemComponent implements OnInit, OnDestroy {
  maxAnswerLength: number = 1000;
  minAnswerLength: number = 10;
  createAnswerSubscription: Subscription | null = null;
  updateAnswerSubscription: Subscription | null = null;
  getQuestionSubscription: Subscription | null = null;
  userId: string | null = null;
  editAnswer: boolean = false;
  @Input() name: string = '';
  @Input() question: QuestionExtendedType | null = null;
  @Input() eventAuthor: number | undefined | null = null;
  @Input() answer: string = '';

  constructor(private eventService: EventService,
              private _snackBar: MatSnackBar,
              private userService: UserService,) {
  }

  ngOnInit() {
    this.userId = this.userService.getUserId()
    this.answer = this.question?.answer ? this.question?.answer.text : ''
  }

  allowEditAnswer (flag: boolean) {
    this.editAnswer = flag;
  }

  proceed() {
    if (this.question?.answer?.id) {
      this.updateAnswerSubscription = this.eventService.updateAnswer(this.question?.answer.id, this.answer).subscribe({
        next: (data: AnswerResponseType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this._snackBar.open('Ваш ответ успешно сохранен');
          this.getQuestion();
          this.editAnswer = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка сохранения ответа')
          }
        }
      });
    } else {
      if (this.question?.id) {
        this.createAnswerSubscription = this.eventService.createAnswer(this.question.id, this.answer).subscribe({
          next: (data: AnswerResponseType | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            this._snackBar.open('Ваш ответ успешно отправлен');
            this.getQuestion();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
            } else {
              this._snackBar.open('Ошибка отправки ответа')
            }
          }
        });
      }
    }
  }

  getQuestion () {
    this.getQuestionSubscription = this.eventService.getQuestion(this.question!.id.toString()).subscribe({
      next: (question: QuestionExtendedType | DefaultResponseType) => {
        if ((question as DefaultResponseType).detail !== undefined) {
          const error = (question as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.question = question as QuestionExtendedType;
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.detail) {
          this._snackBar.open(errorResponse.error.detail)
        } else {
          this._snackBar.open('Ошибка обработки запроса')
        }
      }
    });
  }

  cancelAnswer () {
    if (this.editAnswer) {
      this.editAnswer = !this.editAnswer
    } else {
      this.answer = ''
    }
  }

  ngOnDestroy() {
    this.createAnswerSubscription?.unsubscribe();
    this.updateAnswerSubscription?.unsubscribe();
    this.getQuestionSubscription?.unsubscribe();
  }
}
