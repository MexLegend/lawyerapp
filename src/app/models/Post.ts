export class Post {
  constructor(
    public content: string,
    public title: string,
    public categories?: string,
    public created_at?: string,
    public external_sources?: string,
    public img?: string,
    public status?: string,
    public user?: {
      firstName: string;
      lastName: string;
    },
    public processState?: string,
    public _id?: string
  ) {}
}

export class PostsPagination {
  constructor(
    public docs: Post[],
    public total: number,
    public pages: number,
    public page: number,
    public limit: number
  ) {}
}
