import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuestionExtendedType} from '../../../../../../types/question-extended.type';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DefaultResponseType} from '../../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {EventService} from '../../../../../shared/services/event.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AnswerResponseType} from '../../../../../../types/answer-response.type';
import {UserService} from '../../../../../shared/services/user.service';
import {Settings} from '../../../../../../settings/settings';

@Component({
  selector: 'event-question-item',
  imports: [
    NgIf,
    DatePipe,
    ReactiveFormsModule,
    FormsModule,
    NgClass
  ],
  standalone: true,
  templateUrl: './event-question-item.component.html',
  styleUrl: './event-question-item.component.scss'
})
export class EventQuestionItemComponent implements OnInit, OnDestroy {
  maxAnswerLength: number = Settings.maxAnswerLength;
  minAnswerLength: number = Settings.minAnswerLength;
  createAnswerSubscription: Subscription | null = null;
  updateAnswerSubscription: Subscription | null = null;
  getQuestionSubscription: Subscription | null = null;
  userId: string | null = null;
  editAnswer: boolean = false;
  @Input() name: string = '';
  @Input() question: QuestionExtendedType | null = null;
  @Input() eventAuthor: number | undefined | null = null;
  answerSaved: string = '';
  hasChanged: boolean = false;
  answerForm = this.fb.group({
    answer: ['', [Validators.required, Validators.maxLength(Settings.maxAnswerLength),
      Validators.minLength(Settings.minAnswerLength)]],
  })

  constructor(private eventService: EventService,
              private _snackBar: MatSnackBar,
              private userService: UserService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.userId = this.userService.getUserId()
    this.answerForm.get('answer')?.setValue(this.question?.answer ? this.question?.answer.text : '');
    this.answerSaved = this.answerForm.value.answer as string;
  }

  allowEditAnswer(flag: boolean) {
    this.editAnswer = flag;
  }

  onAnswerChange(): void {
    this.hasChanged = !(this.answerForm.value.answer === this.answerSaved);
  }

  proceed() {
    if (this.hasChanged && this.answerForm.valid) {
      if (this.question?.answer?.id && this.answerForm.value.answer) {
        this.updateAnswerSubscription = this.eventService.updateAnswer(this.question?.answer.id, this.answerForm.value.answer).subscribe({
          next: (data: AnswerResponseType | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            this._snackBar.open('Ваш ответ успешно сохранен');
            this.getQuestion();
            this.editAnswer = false;
            this.hasChanged = false;
            this.answerForm.markAsPristine();
            this.answerForm.markAsUntouched();
            this.answerSaved = this.answerForm.value.answer as string;
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
        if (this.question?.id && this.answerForm.value.answer) {
          this.createAnswerSubscription = this.eventService.createAnswer(this.question.id, this.answerForm.value.answer).subscribe({
            next: (data: AnswerResponseType | DefaultResponseType) => {
              if ((data as DefaultResponseType).detail !== undefined) {
                const error = (data as DefaultResponseType).detail;
                this._snackBar.open(error);
                throw new Error(error);
              }
              this._snackBar.open('Ваш ответ успешно отправлен');
              this.getQuestion();
              this.hasChanged = false;
              this.answerSaved = this.answerForm.value.answer as string;
              this.answerForm.markAsPristine();
              this.answerForm.markAsUntouched();
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
    } else if (this.answerForm.invalid) {
      this._snackBar.open('Форма заполнена некорректно')
    } else {
      this._snackBar.open('Вы не изменили текст ответа!')
    }
  }

  getQuestion() {
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

  cancelAnswer() {
    if (this.editAnswer) {
      this.editAnswer = !this.editAnswer
    }
    this.answerForm.get('answer')?.setValue(this.question?.answer ? this.question.answer.text : '');
    this.answerForm.markAsUntouched();
    this.answerForm.markAsPristine();

  }

  ngOnDestroy() {
    this.createAnswerSubscription?.unsubscribe();
    this.updateAnswerSubscription?.unsubscribe();
    this.getQuestionSubscription?.unsubscribe();
  }
}
