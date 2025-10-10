import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, take} from 'rxjs';
import {ChatMessagesDatedList} from '../../../types/chat-message.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {DialogType} from '../../../types/dialog.type';
import {AuthService} from '../../core/auth/auth.service';
import {TokensResponseType} from '../../../types/tokens-response.type';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: WebSocket | null = null;
  private messagesSubject = new Subject<any>();
  private typingSubject = new Subject<any>();
  private pendingMessage: string | null = null;
  userId: number | null = null;

  private reconnectTimeout: any;
  private reconnectDelay = 3000; // 3 сек
  private currentDialogId: number | null = null;
  private isReconnecting = false;

  private lastTypingSent = 0; // для debounce
  private lastMessageTimestamp: string | null = null;

  /** 👇 Храним ID всех полученных сообщений, чтобы не дублировать */
  private receivedMessageIds = new Set<number>();

  constructor(private http: HttpClient,
              private authService: AuthService,
              private userService: UserService,) {
  }

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

    const userIdString = this.userService.getUserId()
    if (userIdString) {
      this.userId = parseInt(userIdString);
    }

    this.socket = new WebSocket(`ws://${host}/ws/chat/${dialogId}/`, ['jwt', token ? token : 'null']);

    this.socket.onopen = () => {
      console.log('✅ Connected to WebSocket');
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      if (this.isReconnecting) {
        this.syncMessages();
        this.isReconnecting = false;
      }
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        const msg = data.message;

        // ✅ Фильтруем дубликаты по ID
        if (!this.receivedMessageIds.has(msg.id)) {
          this.receivedMessageIds.add(msg.id);
          this.messagesSubject.next(msg);
          this.lastMessageTimestamp = msg.created_at;
        }

        if (msg.sender === this.userId) {
          this.pendingMessage = null;
        }
      } else if (data.type === 'typing') {
        this.typingSubject.next(data.user);
      }
    };

    this.socket.onclose = async (event) => {
      if (event.code === 1000) {
        console.log('⚠️ WebSocket closed');
      } else if (event.code === 4401) {
        await this.refreshAndReconnect();
      } else {
        console.warn('⚠️ WebSocket closed, will try reconnect');
        this.tryReconnect();
      }
    };

    this.socket.onerror = () => {
      console.error('❌ WebSocket error, closing...');
      this.socket?.close();
    };
  }

  private async refreshAndReconnect() {
    if (this.isReconnecting) return;
    this.isReconnecting = true;

    // HTTP refresh
    this.authService.refresh().pipe(take(1)).subscribe({
      next: (data: DefaultResponseType | TokensResponseType) => {
        if ((data as DefaultResponseType).detail !== undefined) {
          console.error("❌ Failed to refresh token", (data as DefaultResponseType).detail);
          this.disconnect();
        }
        console.warn("🔑 Token refreshed, reconnecting...");
        const tokens = data as TokensResponseType;
        this.authService.setTokens(tokens.access, tokens.refresh);

        this.connect(this.currentDialogId!);

        if (this.pendingMessage) {
          setTimeout(() => {
            this.sendMessage(this.pendingMessage!);
            this.pendingMessage = null;
          }, 500);
        }

      },
      error: (errorResponse: HttpErrorResponse) => {
        console.error("❌ Failed to refresh token", errorResponse);
        this.disconnect();
      }
    });
  }

  private tryReconnect() {
    if (this.reconnectTimeout || !this.currentDialogId) return;
    this.isReconnecting = true;
    this.reconnectTimeout = setTimeout(() => {
      console.log('🔄 Reconnecting WebSocket...');
      this.connect(this.currentDialogId!);
    }, this.reconnectDelay);
  }

  disconnect(closeStatus: number | undefined = undefined) {
    this.socket?.close(closeStatus);
    this.socket = null;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  sendMessage(text: string) {
    this.pendingMessage = text
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket?.send(JSON.stringify({action: 'message', text}));
    } else {
      this.tryReconnect();
    }
  }

  sendTyping() {
    const now = Date.now();
    if (now - this.lastTypingSent < 1500) return; // debounce 1.5 сек
    this.lastTypingSent = now;


    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket?.send(JSON.stringify({action: 'typing'}));
    } else {
      this.tryReconnect();
    }

  }

  getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }

  getTyping(): Observable<any> {
    return this.typingSubject.asObservable();
  }

  /** 🔄 Подтягивает только новые сообщения после reconnect */
  private syncMessages() {
    //ToDo sort messages after sync

    if (!this.currentDialogId) return;
    const after = this.lastMessageTimestamp ? `?after=${this.lastMessageTimestamp}` : '';
    console.log(`🔄 Syncing new messages since ${this.lastMessageTimestamp || 'start'}...`);

    this.http.get<ChatMessagesDatedList[] | DefaultResponseType>(`${environment.api}dialogs/${this.currentDialogId}/messages/${after}`)
      .subscribe({
        next: (data: ChatMessagesDatedList[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).detail !== undefined) {
            console.error((data as DefaultResponseType).detail)
          }
          (data as ChatMessagesDatedList[]).forEach((group) => {
            group.messages.forEach((msg) => {
              // ✅ проверяем, не было ли уже такого ID
              if (!this.receivedMessageIds.has(msg.id)) {
                this.receivedMessageIds.add(msg.id);
                this.messagesSubject.next(msg);
                this.lastMessageTimestamp = msg.created_at;
              }
            });
          });
        },
        error: (err) => console.error('❌ Sync error', err),
      });
  }
}
