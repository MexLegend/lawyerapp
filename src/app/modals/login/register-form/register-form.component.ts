import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from 'src/app/models/Usuario';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  form: FormGroup;
  errorEmail: boolean = false;
  userEmail = new Subject<string>();

  constructor(
    private _usuariosS: UsuariosService
  ) {
    this.userEmail.pipe(
      debounceTime(800),
      distinctUntilChanged())
      .subscribe(value => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          this._usuariosS.checkEmail(value)
          .subscribe((resp) => {
            console.log(resp)
            if(resp.exist) {
              this.errorEmail = true;
            } else {
              this.errorEmail = false;
            }
                
            })
        } else {
          console.log(false)
        }
      });
  }

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
