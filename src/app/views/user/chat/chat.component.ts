import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatItemCardComponent} from '../../../shared/components/cards/chat-item-card/chat-item-card.component';
import {ChatAreaComponent} from './chat-area/chat-area.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {DialogType} from '../../../../types/dialog.type';
import {Subscription} from 'rxjs';
import {ChatService} from '../../../shared/services/chat.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {UserShortType} from '../../../../types/user-info.type';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [
    ChatItemCardComponent,
    ChatAreaComponent,
    NgClass,
    NgForOf,
    FormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  isOpenedChat: boolean = false;
  selectedChatIndex: number | null = null;
  dialogList: DialogType[] = [];
  allDialogs: DialogType[] = []; // исходный список без фильтра
  currentCompanion: UserShortType | null = null;
  getDialogListSubscription: Subscription | null = null;
  searchText: string = '';

  constructor(private chatService: ChatService,
              private _snackBar: MatSnackBar,
              private router: Router,) {
  }

  ngOnInit() {
    this.getDialogList();
  }

  getDialogList() {
    this.getDialogListSubscription = this.chatService.getDialogsList()
      .subscribe({
        next: (data: DialogType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            const error = (data as DefaultResponseType).detail;
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.allDialogs = data as DialogType[];
          this.dialogList = [...this.allDialogs]; // копия для отображения
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

  search() {
    const query = this.searchText.trim().toLowerCase();

    if (!query) {
      this.dialogList = [...this.allDialogs]; // если строка пустая → вернуть всё
      return;
    }

    this.dialogList = this.allDialogs.filter(dialog =>
      dialog.companion.full_name.toLowerCase().includes(query)
    );
  }

  closeChat() {
    this.isOpenedChat = false;
    this.selectedChatIndex = null;
  }

  ngOnDestroy() {
    this.getDialogListSubscription?.unsubscribe();
  }
}
