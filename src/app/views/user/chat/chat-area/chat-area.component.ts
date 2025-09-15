import {
  AfterViewChecked,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output, ViewChild
} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {ChatService} from '../../../../shared/services/chat.service';
import {ChatMessagesDatedList, ChatMessageType} from '../../../../../types/chat-message.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {UserShortType} from '../../../../../types/user-info.type';
import {CommonUtils} from '../../../../shared/utils/common-utils';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Settings} from '../../../../../settings/settings';

@Component({
  selector: 'chat-area',
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    DatePipe,
    ReactiveFormsModule,
    RouterLink
  ],
  standalone: true,
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.scss'
})
export class ChatAreaComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Output() onCloseChat: EventEmitter<boolean> = new EventEmitter(false);
  @Input() companion: UserShortType | null = null;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  activatedRouterSubscription: Subscription | null = null;
  getMessageListSubscription: Subscription | null = null;
  sendMessageSubscription: Subscription | null = null;
  chat: ChatMessagesDatedList[] = [];
  dialogId: string | undefined = undefined;
  isTyping = true;
  chatForm = this.fb.group({
    message: ['', [Validators.required, Validators.maxLength(Settings.maxChatMessageLength)]],
  })

  getRussianMonthName = CommonUtils.getRussianMonthName

  constructor(private activatedRoute: ActivatedRoute,
              private chatService: ChatService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder,) {
  }

  ngOnInit() {
    this.activatedRouterSubscription = this.activatedRoute.params.subscribe(param => {
      this.dialogId = param['url'];
      this.getMessageList();

    });
  }

  getMessageList() {
    if (this.dialogId) {
      this.getMessageListSubscription = this.chatService.getMessagesList(this.dialogId)
        .subscribe({
          next: (data: ChatMessagesDatedList[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            this.chat = data as ChatMessagesDatedList[];
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
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  closeChat() {
    this.onCloseChat.emit(false);
  }

  sendMessage() {
    if (this.chatForm.valid && this.dialogId) {
      this.sendMessageSubscription = this.chatService.sendMessage(this.dialogId, this.chatForm.get('message')!.value!)
        .subscribe({
          next: (data: ChatMessageType | DefaultResponseType) => {
            if ((data as DefaultResponseType).detail !== undefined) {
              const error = (data as DefaultResponseType).detail;
              this._snackBar.open(error);
              throw new Error(error);
            }
            this.chatForm.reset();
            this.getMessageList();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.detail) {
              this._snackBar.open(errorResponse.error.detail)
            } else {
              this._snackBar.open('Ошибка отправки сообщения')
            }
          }
        })
    }
  }

  ngOnDestroy() {
    this.activatedRouterSubscription?.unsubscribe();
    this.sendMessageSubscription?.unsubscribe();
    this.getMessageListSubscription?.unsubscribe();
  }

}
