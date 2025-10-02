import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {ChatMessagesDatedList} from '../../../types/chat-message.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {DialogType} from '../../../types/dialog.type';
import {AuthService} from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: WebSocket | null = null;
  private messagesSubject = new Subject<any>();
  private typingSubject = new Subject<any>();

  private reconnectTimeout: any;
  private reconnectDelay = 3000; // 3 сек
  private currentDialogId: number | null = null;

  private lastTypingSent = 0; // для debounce

  constructor(private http: HttpClient,
              private authService: AuthService,) { }

  getMessagesList(dialogId: string): Observable<ChatMessagesDatedList[] | DefaultResponseType> {
    return this.http.get<ChatMessagesDatedList[] | DefaultResponseType>(environment.api + 'dialogs/' + dialogId + '/messages/')
  }

  getDialogsList(): Observable<DialogType[] | DefaultResponseType> {
    return this.http.get<DialogType[] | DefaultResponseType>(environment.api + 'dialogs/')
  }

  getOrCreateDialog(userId: string): Observable<DialogType | DefaultResponseType> {
    return this.http.post<DialogType | DefaultResponseType>(environment.api + 'dialogs/', {user_id: userId});
  }

  // ws

  connect(dialogId: number) {
    this.currentDialogId = dialogId;

    if (this.socket) {
      this.socket.close();
    }
    const token = this.authService.getTokens().accessToken
    const host = environment.host
    this.socket = new WebSocket(`ws://${host}/ws/chat/${dialogId}/`, ['jwt', token ? token : 'null']);

    this.socket.onopen = () => {
      console.log('✅ Connected to WebSocket');
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        this.messagesSubject.next(data.message);
      } else if (data.type === 'typing') {
        this.typingSubject.next(data.user);
      }
    };

    this.socket.onclose = () => {
      console.log('⚠️ WebSocket closed, will try reconnect');
      this.tryReconnect();
    };

    this.socket.onerror = () => {
      console.log('❌ WebSocket error, closing...');
      this.socket?.close();
    };
  }

  private tryReconnect() {
    if (this.reconnectTimeout || !this.currentDialogId) return;

    this.reconnectTimeout = setTimeout(() => {
      console.log('🔄 Reconnecting WebSocket...');
      this.connect(this.currentDialogId!);
    }, this.reconnectDelay);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  sendMessage(text: string) {
    this.socket?.send(JSON.stringify({ action: 'message', text }));
  }

  sendTyping() {
    const now = Date.now();
    if (now - this.lastTypingSent < 1500) return; // debounce 1.5 сек
    this.lastTypingSent = now;

    this.socket?.send(JSON.stringify({ action: 'typing' }));
  }

  getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }

  getTyping(): Observable<any> {
    return this.typingSubject.asObservable();
  }
}
