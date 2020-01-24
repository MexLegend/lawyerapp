export class Files {
    constructor(
        public assigned_client: string,
        public affair: string,
        public description: string,
        public key?: string,
        public end_date?: string,
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