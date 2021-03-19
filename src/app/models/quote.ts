export class Quote {
  constructor(
    public quoteType: string,
    public quoteAuthor: string,
    public quotePageName: string,
    public quoteWebSiteName: string,
    public quoteYear: string,
    public quoteMonth: string,
    public quoteDay: string,
    public quoteUrl: string,
    public quoteTitle: string,
    public quoteCity: string,
    public quotePublisher: string,
    public quoteCaseNumber: string,
    public quoteCourt: string,
    public quotePages: string,
    public quotePeriodicalTitle: string,
    public quoteJournalName: string,
    public quoteInventor: string,
    public quoteCountry: string,
    public quotePatentNumber: string,
    public _id?: string
  ) {}
}

export class QuotePagination {
  constructor(
    public docs: Quote[],
    public total: number,
    public pages: number,
    public page: number,
    public limit: number
  ) {}
}
