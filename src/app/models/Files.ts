export class Files {
    constructor(
        public actor: string,
        public affair: string,
        public assigned_client: any,
        public defendant: string,
        public intKey: string,
        public extKey?: string,
        public observations?: string,
        public third?: string,
        public start_date?: any,
        public status?: string,
        public user?: string,
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