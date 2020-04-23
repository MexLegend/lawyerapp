import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Contact } from '../../models/Contact';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(
    private _contactS: ContactService
  ) {}

  form: FormGroup;

  ngOnInit() {
    this.initContactForm();
  }

  private initContactForm() {
    this.form = new FormGroup({
      nameContact: new FormControl(null, Validators.required),
      emailContact: new FormControl(null, Validators.required),
      messageContact: new FormControl(null, Validators.required),
      phoneContact: new FormControl(null),
      cityContact: new FormControl(null)
    });
  }

  send() {
    console.log(this.form)

    const email = new Contact(
      this.form.value.nameContact,
      this.form.value.emailContact,
      this.form.value.messageContact,
      this.form.value.phoneContact,
      this.form.value.cityContact
    )

    this._contactS.enviarEmail(email).subscribe(resp => {
      console.log(resp)
      this.form.reset()
    })
  }
}
