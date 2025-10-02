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
import {UserService} from '../../../../shared/services/user.service';

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
  @Output() onSendMessage: EventEmitter<boolean> = new EventEmitter(false);
  @Input() companion: UserShortType | null = null;
  @Input() isChatPage: boolean = false;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  dialogId: string | undefined = undefined;
  private typingTimeout: any = null;
  userId: number | null = null;
  activatedRouterSubscription: Subscription | null = null;
  getMessageListSubscription: Subscription | null = null;
  getOrCreateDialogSubscription: Subscription | null = null;
  sendMessageSubscription: Subscription | null = null;
  getMessageSubscription: Subscription | null = null;
  getTypingSubscription: Subscription | null = null;
  chat: ChatMessagesDatedList[] = [];
  isTyping = false;
  isCompanionTyping = false
  chatForm = this.fb.group({
    message: ['', [Validators.required, Validators.maxLength(Settings.maxChatMessageLength)]],
  })

  private subs: Subscription[] = [];

  getRussianMonthName = CommonUtils.getRussianMonthName

  constructor(private activatedRoute: ActivatedRoute,
              private chatService: ChatService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder,
              private userService: UserService,) {
  }

  ngOnInit() {
    const userIdString = this.userService.getUserId()
    if (userIdString) {
      this.userId = parseInt(userIdString);
    }
    if (this.isChatPage) {
      this.activatedRouterSubscription = this.activatedRoute.params.subscribe(param => {
        this.dialogId = param['url'];
        this.connectOrChangeRoom()
      });
    } else {
      this.getDialogId().then(() => this.connectOrChangeRoom());
      setTimeout(() => this.scrollToBottom(), 300);
    }
  }

  connectOrChangeRoom() {
    this.chat = [];
    this.isTyping = false;
    setTimeout(() => {
      this.chatService.connect(parseInt(this.dialogId!));
      this.getMessageList();
      this.getMessages();
      this.getTyping();
    })
  }

  getMessages() {
    this.getMessageSubscription?.unsubscribe();
    this.subs.push(
      this.getMessageSubscription = this.chatService.getMessages().subscribe((msg: ChatMessageType) => {
        this.onSendMessage.emit(true)
        msg.sender_is_user = msg.sender === this.userId;
        if (!msg.sender_is_user) {
          this.isTyping = false;
          this.isCompanionTyping = false;
        }
        const msg_date = CommonUtils.getShortDate(msg.created_at)
        const currentDateChat = this.chat.filter(item => item.date === msg_date)
        if (currentDateChat.length > 0) {
          currentDateChat[0].messages.push(msg)
        } else {
          this.chat.push({date: msg_date, messages: [msg]});
        }
      })
    );
  }

  getTyping() {
    this.getTypingSubscription?.unsubscribe();
    this.subs.push(
      this.getTypingSubscription = this.chatService.getTyping().subscribe(user => {
        console.log(user)
        if (user === null) {
          this.isTyping = false;
          return;
        }

        if (user !== this.userId) {
          this.isTyping = true;
          this.isCompanionTyping = true
          clearTimeout(this.typingTimeout);
          this.typingTimeout = null;
          this.typingTimeout = setTimeout(() => {
            console.log('timeOut')
            this.isTyping = false;
            this.isCompanionTyping = false
          }, 3000);
        } else {
          this.isTyping = this.isCompanionTyping;
        }
      })
    );
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
    } catch (err) {
    }
  }

  closeChat() {
    this.onCloseChat.emit(false);
    this.chat = [];
  }

  sendMessage() {
    if (this.chatForm.invalid) return;

    const text = this.chatForm.value.message;
    this.chatService.sendMessage(text!);

    this.chatForm.reset(); // очищаем поле
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // важно, чтобы не было переноса
      this.sendMessage();
    } else {
      this.chatService.sendTyping();
    }
  }

  ngOnDestroy() {
    this.activatedRouterSubscription?.unsubscribe();
    this.sendMessageSubscription?.unsubscribe();
    this.getMessageSubscription?.unsubscribe();
    this.getMessageListSubscription?.unsubscribe();
    this.chatService.disconnect();
    this.subs.forEach(s => s.unsubscribe());
  }

}
