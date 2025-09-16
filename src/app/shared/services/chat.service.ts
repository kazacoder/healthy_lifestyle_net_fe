import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChatMessagesDatedList, ChatMessageType} from '../../../types/chat-message.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {DialogType} from '../../../types/dialog.type';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getMessagesList(dialogId: string): Observable<ChatMessagesDatedList[] | DefaultResponseType> {
    return this.http.get<ChatMessagesDatedList[] | DefaultResponseType>(environment.api + 'dialogs/' + dialogId + '/messages/')
  }

  getDialogsList(): Observable<DialogType[] | DefaultResponseType> {
    return this.http.get<DialogType[] | DefaultResponseType>(environment.api + 'dialogs/')
  }

  getOrCreateDialog(userId: string): Observable<DialogType | DefaultResponseType> {
    return this.http.post<DialogType | DefaultResponseType>(environment.api + 'dialogs/', {user_id: userId});
  }

  sendMessage(dialogId: string, text: string): Observable<ChatMessageType | DefaultResponseType> {
    return this.http.post<ChatMessageType | DefaultResponseType>(environment.api + 'dialogs/' + dialogId + '/messages/',
      {text: text})
  }
}
