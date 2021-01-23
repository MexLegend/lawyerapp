export class Cases {
    constructor(
        public actor: string,
        public affair: string,
        public assigned_client: any,
        public defendant: string,
        public intKey: string,
        public extKey?: string,
        public observations?: string,
        public third?: string,
        public tracks?: any,
        public start_date?: any,
        public status?: string,
        public user?: string,
        public _id?: string
    ) { }
}

export class CasesPagination {
    constructor(
        public docs: Cases[],
        public total: number,
        public pages: number,
        public page: number,
        public limit: number
    ) { }
}