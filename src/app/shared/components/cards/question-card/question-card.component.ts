import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {QuestionExtendedType} from '../../../../../types/question-extended.type';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Settings} from '../../../../../settings/settings';
import {EventService} from '../../../services/event.service';
import {MatSnackBar} from '@angular/material/snack-bar';
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
  isAnswerFormOpened: boolean = false;
  answerForm = this.fb.group({
    answer: ['', [Validators.required, Validators.maxLength(Settings.maxAnswerLength),
      Validators.minLength(Settings.minAnswerLength)]],
  })

  constructor(private eventService: EventService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.answerForm.get('answer')?.setValue(this.question?.answer ? this.question?.answer.text : '');
  }

  proceed(eventId: string | undefined) {
        if (this.question?.id && this.answerForm.value.answer) {
          this.createAnswerSubscription = this.eventService.createAnswer(this.question.id, this.answerForm.value.answer).subscribe({
            next: (data: AnswerResponseType | DefaultResponseType) => {
              if ((data as DefaultResponseType).detail !== undefined) {
                const error = (data as DefaultResponseType).detail;
                this._snackBar.open(error);
                throw new Error(error);
              }
              this._snackBar.open('Ваш ответ успешно отправлен');
              this.answerForm.reset();
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

  toggleAnswerForm(): void {
    if (this.isAnswerFormOpened) {
      this.answerForm.reset();
    }
    this.isAnswerFormOpened = !this.isAnswerFormOpened;
  }

  ngOnDestroy() {
    this.createAnswerSubscription?.unsubscribe();
  }
}
