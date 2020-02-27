import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../../services/contacto.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Contacto } from '../../models/Contacto';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  form: FormGroup;

  constructor(
    private _contactoS: ContactoService
  ) { }

  ngOnInit() {
    this.initcontactoForm();
  }

  private initcontactoForm() {
    this.form = new FormGroup({
      nameContacto: new FormControl(null, Validators.required),
      emailContacto: new FormControl(null, Validators.required),
      messageContacto: new FormControl(null, Validators.required),
      phoneContacto: new FormControl(null),
      cityContacto: new FormControl(null)
    });
  }

  enviar() {
    console.log(this.form)

    const email = new Contacto(
      this.form.value.nameContacto,
      this.form.value.emailContacto,
      this.form.value.messageContacto,
      this.form.value.phoneContacto,
      this.form.value.cityContacto
    )

    this._contactoS.enviarEmail(email).subscribe(resp => {
      console.log(resp)
      this.form.reset()
    })
  }
}
