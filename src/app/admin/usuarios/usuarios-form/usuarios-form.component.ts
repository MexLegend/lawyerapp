import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../../models/Usuario';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css']
})
export class UsuariosFormComponent implements OnInit {

  form: FormGroup;

  constructor(
    private _usuariosS: UsuariosService
  ) { }

  ngOnInit() {
    this.initRegisterForm();
  }

  private initRegisterForm() {
    this.form = new FormGroup({
      address: new FormControl(null, Validators.required),
      cellPhone: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      img: new FormControl(null)
    });
  }

  crear() {
    // return console.log(this.form)

    const usuario = new Usuario(
      this.form.value.address,
      this.form.value.cellPhone,
      this.form.value.email,
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.password,
      null,
      this.form.value.img
    );

    this._usuariosS.crearUsuario(usuario).subscribe(resp => {
      this.form.reset();
    });
  }

}
