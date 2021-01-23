export class Notification {
  constructor(
    public image: string,
    public title: string,
    public type: string,
    public url_path: string,
    public created_at?: string,
    public show_buttons?: boolean,
    public user_actor?: string,
    public user_actor_role?: string,
    public _id?: string
  ) {}
}

export class NotificationsPagination {
  constructor(
    public docs: Notification[],
    public total: number,
    public pages: number,
    public page: number,
    public limit: number
  ) {}
}
