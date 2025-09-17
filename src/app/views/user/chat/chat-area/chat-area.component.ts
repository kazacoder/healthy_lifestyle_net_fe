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
import {DialogType} from '../../../../../types/dialog.type';

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
  @Input() isChatPage: boolean = false;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  dialogId: string | undefined = undefined;
  activatedRouterSubscription: Subscription | null = null;
  getMessageListSubscription: Subscription | null = null;
  getOrCreateDialogSubscription: Subscription | null = null;
  sendMessageSubscription: Subscription | null = null;
  chat: ChatMessagesDatedList[] = [];
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
    if (this.isChatPage) {
      this.activatedRouterSubscription = this.activatedRoute.params.subscribe(param => {
        this.dialogId = param['url'];
        this.getMessageList();
      });
    } else {
      this.getDialogId().then(() => this.getMessageList());
      setTimeout(() => this.scrollToBottom(), 300);
    }
  }

  getDialogId(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.companion) {
        this.getOrCreateDialogSubscription = this.chatService.getOrCreateDialog(this.companion.id)
          .subscribe({
            next: (data: DialogType | DefaultResponseType) => {
              if ((data as DefaultResponseType).detail !== undefined) {
                const error = (data as DefaultResponseType).detail;
                this._snackBar.open(error);
                reject(error);
                throw new Error(error);
              }
              this.dialogId = (data as DialogType).id.toString();
              resolve(this.dialogId);
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.detail) {
                this._snackBar.open(errorResponse.error.detail)
              } else {
                this._snackBar.open('Ошибка получения данных')
              }
              reject(errorResponse);
            }
          });
      }
    })
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
            this.scrollToBottom();
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
    if (this.isChatPage) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      // this.scrollContainer.nativeElement.scrollTo({ top: this.scrollContainer.nativeElement.scrollHeight, behavior: 'smooth' });
    } catch(err) { }
  }

  closeChat() {
    this.onCloseChat.emit(false);
    this.chat = [];
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
