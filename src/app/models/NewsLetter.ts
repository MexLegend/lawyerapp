export class NewsLetter {
  constructor(
    public email: string,
    public isConfirmed?: boolean,
    public status?: boolean,
    public suscribed_at?: string,
    public _id?: string
  ) {}
}

export class NewsLetterPagination {
  constructor(
    public docs: NewsLetter[],
    public total: number,
    public pages: number,
    public page: number,
    public limit: number
  ) {}
}
