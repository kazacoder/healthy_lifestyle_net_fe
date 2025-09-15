import {ChatMessageType} from './chat-message.type';
import {UserShortType} from './user-info.type';

export type DialogType = {
  id: number;
  companion: UserShortType;
  created_at: string; // ISO строка даты
  last_message: ChatMessageType;
  messages_count: number;
}

