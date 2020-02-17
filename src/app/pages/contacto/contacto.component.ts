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
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      phone: new FormControl(null),
      city: new FormControl(null),
      message: new FormControl(null)
    });
  }

  enviar() {
    console.log(this.form)

    const email = new Contacto(
      this.form.value.name,
      this.form.value.email,
      this.form.value.phone,
      this.form.value.city,
      this.form.value.message
    )

    this._contactoS.enviarEmail(email).subscribe(resp => {
      console.log(resp)
      this.form.reset()
    })
  }
}
