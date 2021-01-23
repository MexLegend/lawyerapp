export class Tracking {
  constructor(
    public volume: string,
    public date?: Date,
    public evidenceId?: string,
    public evidences?: [
      {
        evidence: string;
        _id?: string;
      }
    ],
    public message?: string,
    public noteId?: string,
    public notes?: [
      {
        note: string;
        _id?: string;
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
