export class UserNotification {
  constructor(
    public notification_id: string,
    public user_receiver: string,
    public allowed_roles?: string,
    public is_viewed?: boolean,
    public users_viewed?: string,
    public _id?: string
  ) {}
}

export class UserNotificationsPagination {
  constructor(
    public docs: UserNotification[],
    public total: number,
    public pages: number,
    public page: number,
    public limit: number
  ) {}
}
