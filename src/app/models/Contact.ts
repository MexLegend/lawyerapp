export class Contact {
  constructor(
    public nameContact: string,
    public emailSender: string,
    public messageContact: string,
    public emailReceiver: string,
    public subject: string,
    public lawyerName?: string,
    public phoneContact?: string,
    public id?: string,
    public cityContact?: string
  ) {}
}
