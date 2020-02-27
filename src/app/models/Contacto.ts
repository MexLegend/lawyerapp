export class Contacto {
    constructor(
        public nameContacto: string,
        public emailContacto: string,
        public messageContacto: string,
        public phoneContacto?: string,
        public cityContacto?: string
    ) { }
}
