export class ComponentData {
  constructor(
    public title: string,
    public subtitle: string,
    public buttonPrimaryText: string,
    public buttonPrimaryAction: Function,
    public buttonSecondary: boolean,
    public buttonSecondaryText: string,
    public buttonSecondaryAction: Function,
    public form: boolean,
    public formInputs: string,
    public login: boolean,
    public sended: boolean
  ) {}
}
