export class PostAnalytics {
  constructor(
    public post: string,
    public comments?: [
      {
        comment: String;
        date: Date;
        user: string;
        _id: string;
      }
    ],
    public dislikes?: number,
    public likes?: number,
    public reactions?: [
      {
        date: Date;
        reaction: any;
        user: string;
        _id: string;
      }
    ],
    public _id?: string
  ) {}
}
