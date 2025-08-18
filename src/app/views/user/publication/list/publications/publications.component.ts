import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
  PublicationCardComponent
} from '../../../../../shared/components/cards/publication-card/publication-card.component';
import {DefaultResponseType} from '../../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PublicationService} from '../../../../../shared/services/publication.service';
import {Subscription} from 'rxjs';
import {PublicationType} from '../../../../../../types/publication.type';
import {NgForOf} from '@angular/common';
import {
  ParticipantsModalComponent
} from '../../../../../shared/components/modals/participants-modal/participants-modal.component';
import {WindowsUtils} from '../../../../../shared/utils/windows-utils';
import {PublicationParticipantType} from '../../../../../../types/publication-participant.type';
import {
  QuestionsAnswersModalComponent
} from '../../../../../shared/components/modals/questions-answers-modal/questions-answers-modal.component';
import {EventService} from '../../../../../shared/services/event.service';
import {QuestionExtendedType} from '../../../../../../types/question-extended.type';
import {EventQuestionsAnswersResponseType} from '../../../../../../types/event-questions-answers-response.type';

@Component({
  selector: 'app-publications',
  imports: [
    RouterLink,
    PublicationCardComponent,
    NgForOf,
    ParticipantsModalComponent,
    QuestionsAnswersModalComponent
  ],
  standalone: true,
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.scss'
})
export class PublicationsComponent implements OnInit, OnDestroy {

  getEventsListSubscription: Subscription | null = null;
  publications: PublicationType[] = [];
  isParticipantsModalOpened: boolean = false;
  isQuestionsAnswersModalOpened: boolean = false;
  participantList: PublicationParticipantType[] = [];
  questionsSubscription: Subscription | null = null;
  questions: QuestionExtendedType[] = [];
  questionsWithAnswer: QuestionExtendedType[] = [];

  constructor(private _snackBar: MatSnackBar,
              private publicationService: PublicationService,
              private eventService: EventService) {

  }

  ngOnInit() {
    this.getEventsListSubscription = this.publicationService.getPublicationsList().subscribe({
      next: (data: PublicationType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          const error = (data as DefaultResponseType).detail;
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.publications = data as PublicationType[];
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

  proceedParticipantsModal(value: boolean, participantList?: PublicationParticipantType[]) {
    if (participantList) {
      this.participantList = participantList;
    }
    this.isParticipantsModalOpened = value;
    WindowsUtils.fixBody(value)
  }

  proceedQuestionsAnswersModal(value: { isOpened: boolean, eventId?: number }) {
    if (value.eventId) {
      this.getEventQuestionResponse(value.eventId.toString())
    }
    this.isQuestionsAnswersModalOpened = value.isOpened;
    WindowsUtils.fixBody(value.isOpened)
  }

  getEventQuestionResponse(eventId: string) {
    this.questionsSubscription = this.eventService
      .getQuestionsWithAnswersAnwWithout(eventId)
      .subscribe({
        next: (data: EventQuestionsAnswersResponseType | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.questions = (data as EventQuestionsAnswersResponseType).questions_without_answers;
          this.questionsWithAnswer = (data as EventQuestionsAnswersResponseType).questions_with_answers;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.detail) {
            this._snackBar.open(errorResponse.error.detail)
          } else {
            this._snackBar.open('Ошибка получения данных')
          }
        }
      });
  }

  onPublicationDeleted(deletedId: number) {
    this.publications = this.publications.filter(publication => publication.id !== deletedId);
  }

  ngOnDestroy() {
    this.getEventsListSubscription?.unsubscribe();
    this.questionsSubscription?.unsubscribe();
  }
}
