import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { User } from "../../models/User";
import { UsersService } from "../../services/users.service";
import { ContactService } from "../../services/contact.service";
import { Contact } from "../../models/Contact";

@Component({
  selector: "app-reply",
  templateUrl: "./reply.component.html",
  styleUrls: ["./reply.component.css"],
})
export class ReplyComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _contactS: ContactService,
    public dialogRef: MatDialogRef<ReplyComponent>,
    public _usersS: UsersService
  ) {}

  public config: PerfectScrollbarConfigInterface = {};
  form: FormGroup;
  to: User = null;
  action: string = null;

  ngOnInit() {
    this.initCommentForm();

    if (this.data) {
      this.to = this.data.user;
      this.action = this.data.action;
    }
  }

  private initCommentForm() {
    this.form = new FormGroup({
      emailSender: new FormControl(
        this._usersS.user.email || null,
        Validators.required
      ),
      messageContact: new FormControl(null, Validators.required),
      _id: new FormControl(null),
    });
  }

  sendEmail() {
    const email = new Contact(
      this._usersS.user.firstName + " " + this._usersS.user.lastName,
      this.form.value.emailSender,
      this.form.value.messageContact,
      this.to.email,
      "Nuevo formulario de contacto",
      this.to.firstName + " " + this.to.lastName,
      this._usersS.user.cellPhone
    );

    const sendEmailSub = this._contactS
      .enviarEmail(email, "lawyerContact", this.dialogRef)
      .subscribe(() => {
        this.form.reset();
        sendEmailSub.unsubscribe();
      });
  }
}
