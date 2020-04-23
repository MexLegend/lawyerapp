export class Files {
    constructor(
        public actor: string,
        public affair: string,
        public assigned_client: any,
        public defendant: string,
        public intKey: string,
        public comments?: {
            comment: string,
            date: Date,
            numV: number
        },
        public documents?: {
            date?: Date,
            document: string,
            numV: number
        },
        public extKey?: string,
        public observations?: string,
        public start_date?: string,
        public status?: string,
        public third?: string,
        public user?: string,
        public volumes?: {
            date: Date,
            num: number,
            volume: string
        },
        public _id?: string
    ) { }
}

export class FilesPagination {
    constructor(
        public docs: Files[],
        public total: number,
        public pages: number,
        public page: number,
        public limit: number
    ) { }
}