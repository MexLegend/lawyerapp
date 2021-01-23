export class Evidence {
    constructor(
      public evidences: [{
              date?: Date,
              _id?: string,
              evidence: string,
              status: string
      }],
      public _id?: string
    ) {}
  }
  
  export class EvidencesPagination {
    constructor(
      public docs: Evidence[],
      public total: number,
      public pages: number,
      public page: number,
      public limit: number
    ) {}
  }
  