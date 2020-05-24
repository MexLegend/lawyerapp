export class Tracking {
  constructor(
    public file: string,
    public comments?: [
      {
        comment: string;
        date: Date;
        numV: number;
      }
    ],
    public date?: Date,
    public documents?: [
      {
        date?: Date;
        document: string;
        numV: number;
        _id?: string
      }
    ],
    public status?: string,
    public track?: number,
    public volumes?: [
      {
        date: Date;
        num: number;
      }
    ],
    public _id?: string
  ) {}
}

export class TrackingsPagination {
  constructor(
    public docs: Tracking[],
    public total: number,
    public pages: number,
    public page: number,
    public limit: number
  ) {}
}
