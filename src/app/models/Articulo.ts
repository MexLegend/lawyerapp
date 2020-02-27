export class Articulo {
    constructor(
        public author: string,
        public content: string,
        public title: string,
        public created_at?: string,
        public img?: string,
        public status?: string,
        public user?: string,
        public _id?: string
    ) { }
}

export class ArticulosPaginacion {
    constructor(
        public docs: Articulo[],
        public total: number,
        public pages: number,
        public page: number,
        public limit: number
    ) { }
}