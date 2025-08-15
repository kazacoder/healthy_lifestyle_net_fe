import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {QuestionExtendedType} from '../../../../../types/question-extended.type';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Settings} from '../../../../../settings/settings';
import {EventService} from '../../../services/event.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../../services/user.service';
import {Subscription} from 'rxjs';
import {AnswerResponseType} from '../../../../../types/answer-response.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'question-card',
  imports: [
    NgClass,
    DatePipe,
    NgIf,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss'
})
export class QuestionCardComponent implements OnInit, OnDestroy {
  @Input() question: QuestionExtendedType | null = null;
  @Output() onSaveAnswer: EventEmitter<string> = new EventEmitter();
  maxAnswerLength: number = Settings.maxAnswerLength;
  minAnswerLength: number = Settings.minAnswerLength;
  createAnswerSubscription: Subscription | null = null;
  updateAnswerSubscription: Subscription | null = null;
  getQuestionSubscription: Subscription | null = null;
  isAnswerFormOpened: boolean = false;
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
    this.answerForm.get('answer')?.setValue(this.question?.answer ? this.question?.answer.text : '');
    this.answerSaved = this.answerForm.value.answer as string;
  }

  onAnswerChange(): void {
    this.hasChanged = !(this.answerForm.value.answer === this.answerSaved);
  }

  //ToDO исправить - тут не должно быть редактирования!
  proceed(eventId: string | undefined) {
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
            this.hasChanged = false;
            this.answerForm.markAsPristine();
            this.answerForm.markAsUntouched();
            this.answerSaved = this.answerForm.value.answer as string;
            this.onSaveAnswer.emit(eventId);
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
              this.hasChanged = false;
              this.answerSaved = this.answerForm.value.answer as string;
              this.answerForm.markAsPristine();
              this.answerForm.markAsUntouched();
              this.onSaveAnswer.emit(eventId);
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

  toggleAnswerForm(): void {
    this.isAnswerFormOpened = !this.isAnswerFormOpened;
  }

  ngOnDestroy() {
    this.createAnswerSubscription?.unsubscribe();
    this.updateAnswerSubscription?.unsubscribe();
    this.getQuestionSubscription?.unsubscribe();
  }
}
