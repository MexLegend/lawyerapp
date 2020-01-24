import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  form: FormGroup;

  constructor(
    private _usuariosS: UsuariosService
  ) { }

  ngOnInit() {
    this.initRegisterForm();
  }

  private initRegisterForm() {
    this.form = new FormGroup({
      email: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      address: new FormControl(null),
      cellPhone: new FormControl(null),
      img: new FormControl(null)
    });
  }

  crear() {
    // console.log(this.form);

    const usuario = new Usuario(
      this.form.value.email,
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.password, 
      this.form.value.address,
      this.form.value.cellPhone,
      null,
      this.form.value.img
    );

    this._usuariosS.crearUsuario(usuario).subscribe(resp => {
      this.form.reset();
    });
  }

}
