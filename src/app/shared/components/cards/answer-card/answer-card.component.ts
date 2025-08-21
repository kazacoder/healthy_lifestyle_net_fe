import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DatePipe, NgClass, NgIf, SlicePipe} from '@angular/common';
import {QuestionExtendedType} from '../../../../../types/question-extended.type';
import {ConfirmModalComponent} from '../../modals/confirm-modal/confirm-modal.component';
import {WindowsUtils} from '../../../utils/windows-utils';
import {AnswerResponseType} from '../../../../../types/answer-response.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Settings} from '../../../../../settings/settings';
import {EventService} from '../../../services/event.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

@Component({
  selector: 'answer-card',
  imports: [
    DatePipe,
    NgIf,
    ConfirmModalComponent,
    SlicePipe,
    NgClass,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './answer-card.component.html',
  styleUrl: './answer-card.component.scss'
})
export class AnswerCardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() questionsWithAnswer: QuestionExtendedType | null = null;
  @Output() onDeleteAnswer: EventEmitter<string> = new EventEmitter();
  maxAnswerLength: number = Settings.maxAnswerLength;
  minAnswerLength: number = Settings.minAnswerLength;
  edit: boolean = false;
  isOpenConfirmModal: boolean = false;
  updateAnswerSubscription: Subscription | null = null;
  deleteAnswerSubscription: Subscription | null = null;
  hasChanged: boolean = false;
  answerSaved: string = '';
  answerForm = this.fb.group({
    answer: ['', [Validators.required, Validators.maxLength(Settings.maxAnswerLength),
      Validators.minLength(Settings.minAnswerLength)]],
  })

  constructor(private eventService: EventService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.answerForm.get('answer')?.setValue(this.questionsWithAnswer?.answer ? this.questionsWithAnswer?.answer.text : '');
    this.answerSaved = this.questionsWithAnswer?.answer.text ? this.questionsWithAnswer?.answer.text : '';
  }


  saveAnswer() {
    if (this.hasChanged && this.answerForm.valid) {
      if (this.questionsWithAnswer?.answer?.id && this.answerForm.value.answer) {
        this.updateAnswerSubscription = this.eventService.updateAnswer(this.questionsWithAnswer?.answer.id, this.answerForm.value.answer).subscribe({
          next: (data: AnswerResponseType | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            this._snackBar.open('Ваш ответ успешно сохранен');
            this.hasChanged = false;
            this.answerForm.reset();
            this.edit = false;
            if (this.questionsWithAnswer) {
              this.questionsWithAnswer.answer.text = (data as AnswerResponseType).text;
              this.answerSaved = (data as AnswerResponseType).text;
              this.answerForm.get('answer')?.setValue(this.questionsWithAnswer.answer.text);
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
            } else {
              this._snackBar.open('Ошибка сохранения ответа')
            }
          }
        });
      }
    } else if (this.answerForm.invalid) {
      this._snackBar.open('Форма заполнена некорректно')
    } else {
      this._snackBar.open('Вы не изменили текст ответа!')
    }
  }

  onAnswerChange(): void {
    this.hasChanged = !(this.answerForm.value.answer === this.answerSaved);
  }


  getLineCount(el: HTMLElement): number {
    const styles = window.getComputedStyle(el);
    const lineHeight = parseFloat(styles.lineHeight);
    const height = el.offsetHeight;
    return Math.round(height / lineHeight);
  }

  ngAfterViewInit() {
    if (this.questionsWithAnswer?.id) {
      const desc = document.getElementById(this.questionsWithAnswer?.id.toString()) as HTMLElement;
      const lines = this.getLineCount(desc);
      if (lines > 3) {
        desc.parentElement?.parentElement?.classList.remove('_open');
      }
    }
  }


  cancel() {
    this.toggleEdit();
    this.answerForm.get('answer')?.setValue(this.questionsWithAnswer?.answer ? this.questionsWithAnswer?.answer.text : '');
  }


  toggleEdit() {
    this.edit = !this.edit;
  }

  removeAnswer(eventId: string | undefined) {
    if (this.questionsWithAnswer?.id) {
      this.deleteAnswerSubscription = this.eventService.deleteAnswer(this.questionsWithAnswer.answer.id)
        .subscribe({
          next: (data: null | DefaultResponseType) => {
            if (data && (data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            this.toggleDeleteModal(false);
            this.onDeleteAnswer.emit(eventId);
            this._snackBar.open('Ответ удален')
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
            } else {
              this._snackBar.open('Ошибка уделения ответа')
            }
          }
        });
    }
  }

  toggleDeleteModal(val: boolean) {
    this.isOpenConfirmModal = val;
    WindowsUtils.fixBody(val);
  }

  showMore(el: HTMLElement) {
    el.classList.add('_open');
  }

  ngOnDestroy() {
    this.updateAnswerSubscription?.unsubscribe();
    this.deleteAnswerSubscription?.unsubscribe();
  }
}
