export class Note {
  constructor(
    public notes: [{
            affair: string,
            message: string,
            status: string
    }],
    public status: string,
    public date?: Date,
    public _id?: string
  ) {}
}

export class NotesPagination {
  constructor(
    public docs: Note[],
    public total: number,
    public pages: number,
    public page: number,
    public limit: number
  ) {}
}
