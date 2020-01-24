export class Notification {
    constructor(
      public body: string,
      public title: string,
      public created_at?: string,
      public icon?: string,
      public status?: string,
      public user?: string,
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
  