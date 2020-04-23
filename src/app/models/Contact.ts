export class Contact {
    constructor(
        public nameContact: string,
        public emailContact: string,
        public messageContact: string,
        public phoneContact?: string,
        public cityContact?: string
    ) { }
}
