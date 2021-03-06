import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Contact } from "../../models/Contact";
import { ContactService } from "../../services/contact.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent implements OnInit {
  constructor(private _contactS: ContactService) {}

  subscriptionsArray: Subscription[] = [];

  form: FormGroup;

  ngOnInit() {
    this.initContactForm();
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  private initContactForm() {
    this.form = new FormGroup({
      nameContact: new FormControl(null, Validators.required),
      emailContact: new FormControl(null, Validators.required),
      messageContact: new FormControl(null, Validators.required),
      phoneContact: new FormControl(null),
    });
  }

  send() {
    const email = new Contact(
      this.form.value.nameContact,
      this.form.value.emailContact,
      this.form.value.messageContact,
      this.form.value.phoneContact
    );

    this.subscriptionsArray.push(
      this._contactS.enviarEmail(email).subscribe((resp) => {
        console.log(resp);
        this.form.reset();
      })
    );
  }
}
