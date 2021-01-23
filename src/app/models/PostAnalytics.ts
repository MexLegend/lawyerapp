export class PostAnalytics {
  constructor(
    public post: string,
    public comments?: [
      {
        comment: Date;
        user: string;
        _id: string;
      }
    ],
    public dislikes?: number,
    public likes?: number,
    public reactions?: [
      {
        reaction: Date;
        user: string;
        _id: string;
      }
    ],
    public _id?: string
  ) {}
}
