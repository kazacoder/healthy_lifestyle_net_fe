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
import {Settings} from '../../../../../settings/settings';
import {ClaimModalComponent} from '../../../../shared/components/modals/claim-modal/claim-modal.component';
import {WindowsUtils} from '../../../../shared/utils/windows-utils';

@Component({
  selector: 'event-questions',
  imports: [
    EventQuestionItemComponent,
    FormsModule,
    NgIf,
    NgForOf,
    ClaimModalComponent
  ],
  standalone: true,
  templateUrl: './event-questions.component.html',
  styleUrl: './event-questions.component.scss'
})
export class EventQuestionsComponent implements OnInit, OnDestroy {
  question: string = '';
  maxQuestionLength: number = Settings.maxQuestionLength;
  minQuestionLength: number = Settings.minQuestionLength;
  isLogged: boolean = false;
  isLoggedSubscription: Subscription | null = null;
  questionResponse: EventQuestionResponseType | null = null;
  answersSubscription: Subscription | null = null;
  createQuestionSubscription: Subscription | null = null;
  offset: number = 0;
  showMoreButton: boolean = false;
  isClaimModalOpen: boolean = false;
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

  getEventQuestionResponse(offset: number = 0) {
    if (this.eventId) {
      this.answersSubscription = this.eventService
        .getQuestionsWithAnswers(this.eventId, Settings.questionDefaultLimit, offset)
        .subscribe({
          next: (data: EventQuestionResponseType | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            if (offset > 0 && this.questionResponse) {
              const results = this.questionResponse.results;
              this.questionResponse = data as EventQuestionResponseType;
              this.questionResponse.results = Array.prototype.concat(results, this.questionResponse.results);
            } else {
              this.questionResponse = data as EventQuestionResponseType;
            }
            this.showMoreButton = this.questionResponse.count > this.questionResponse.results.length;
            this.offset = this.questionResponse.results.length;
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

  toggleClaimModal(val: boolean) {
    this.isClaimModalOpen = val;
    WindowsUtils.fixBody(val);
  }

  ngOnDestroy() {
    this.isLoggedSubscription?.unsubscribe()
    this.createQuestionSubscription?.unsubscribe()
    this.answersSubscription?.unsubscribe()
  }
}
