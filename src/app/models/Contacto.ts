export class Contacto {
    constructor(
        public name: string,
        public email: string,
        public phone?: string,
        public city?: string,
        public message?: string
    ) { }
}
