export class Files {
    constructor(
        public actor: string,
        public affair: string,
        public assigned_client: any,
        public defendant: string,
        public intKey: string,
        public description?: string,
        public third?: string,
        public extKey?: string,
        public start_date?: string,
        public status?: string,
        public user?: string,
        public _id?: string
    ) { }
}

export class FilesPaginacion {
    constructor(
        public docs: Files[],
        public total: number,
        public pages: number,
        public page: number,
        public limit: number
    ) { }
}