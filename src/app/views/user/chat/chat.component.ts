import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatItemCardComponent} from '../../../shared/components/cards/chat-item-card/chat-item-card.component';
import {ChatAreaComponent} from './chat-area/chat-area.component';
import {NgClass, NgForOf} from '@angular/common';
import {DialogType} from '../../../../types/dialog.type';
import {Subscription} from 'rxjs';
import {ChatService} from '../../../shared/services/chat.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {UserShortType} from '../../../../types/user-info.type';

@Component({
  selector: 'app-chat',
  imports: [
    ChatItemCardComponent,
    ChatAreaComponent,
    NgClass,
    NgForOf
  ],
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  isOpenedChat: boolean = false;
  selectedChatIndex: number | null = null;
  dialogList: DialogType[] = [];
  currentCompanion: UserShortType | null = null;
  getDialogListSubscription: Subscription | null = null;

  constructor(private chatService: ChatService,
              private _snackBar: MatSnackBar,
              private router: Router,) {
  }

  ngOnInit() {
    this.getDialogListSubscription = this.chatService.getDialogsList()
      .subscribe({
        next: (data: DialogType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.dialogList = data as DialogType[];
          this.router.navigate(['/profile/messages/' + this.dialogList[0].id]).then();
          this.selectedChatIndex = this.dialogList[0].id;
          this.currentCompanion = this.dialogList[0].companion;
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

  openChat(index: number, companion: UserShortType) {
    this.isOpenedChat = true;
    this.selectedChatIndex = index;
    this.currentCompanion = companion
    this.router.navigate(['/profile/messages/' + index]).then()
  }

  closeChat() {
    this.isOpenedChat = false;
    this.selectedChatIndex = null;
  }

  ngOnDestroy() {
    this.getDialogListSubscription?.unsubscribe();
  }
}
