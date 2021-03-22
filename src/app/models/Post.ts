import { Quote } from "./quote";

export class Post {
  constructor(
    public postContent: string,
    public postTitle: string,
    public postFolder?: string, 
    public attachedFiles?: string,
    public postCategories?: any,
    public created_at?: string,
    public postImage?: string,
    public postImagesList?: string,
    public processState?: string,
    public postQuotes?: [Quote],
    public status?: string,
    public user?: {
      firstName: string;
      lastName: string;
    },
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
