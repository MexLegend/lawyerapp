export class User {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public password: string,
        public password2?: string,
        public address?: string,
        public cellPhone?: string,
        public lawyer?: string,
        public created_at?: string,
        public img?: string,
        public role?: string,
        public status?: boolean,
        public _id?: string
    ) { }
}

export class UsersPagination {
    constructor(
        public docs: User[],
        public total: number,
        public pages: number,
        public page: number,
        public limit: number
    ) { }
}