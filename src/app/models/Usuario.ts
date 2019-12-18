export class Usuario {
    constructor(
        public address: string,
        public cellPhone: string,
        public email: string,
        public firstName: string,
        public lastName: string,
        public password: string,
        public created_at?: string,
        public img?: string,
        public role?: string,
        public status?: boolean,
        public _id?: string
    ) { }
}

export class UsuariosPaginacion {
    constructor(
        public docs: Usuario[],
        public total: number,
        public pages: number,
        public page: number,
        public limit: number
    ) { }
}