export class ChatRoom {
  constructor(
    public name: string,
    public members: string,
    public creator_id?: string,
    public image?: string
  ) {}
}
