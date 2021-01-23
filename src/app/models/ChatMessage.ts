export class ChatMessage {
  constructor(
    public author_id: string,
    public chat_room_id: string,
    public attachments?: string,
    public deleted?: string,
    public message?: string,
    public status?: string
  ) {}
}
