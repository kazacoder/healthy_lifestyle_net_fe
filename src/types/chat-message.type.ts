export type ChatMessageType = {
  id: number;
  sender: number;
  sender_is_user: boolean;
  sender_full_name: string;
  sender_is_master: boolean;
  sender_photo: string;
  text: string;
  created_at: string; // ISO строка даты
  is_read: boolean;
}

export type ChatMessagesDatedList = {
  date: string;
  messages: ChatMessageType[];
}
