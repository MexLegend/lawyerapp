import { Quote } from "./quote";

export class PracticeArea {
  constructor(
    public name: string,
    public faq: [
      {
        answer: string;
        question: string;
      }
    ],
    public author?: string,
    public is_category?: boolean,
    public quotes?: [Quote],
    public review?: string,
    public _id?: string
  ) {}
}

export class PracticeAreaPagination {
  constructor(
    public docs: PracticeArea[],
    public total: number,
    public pages: number,
    public page: number,
    public limit: number
  ) {}
}
