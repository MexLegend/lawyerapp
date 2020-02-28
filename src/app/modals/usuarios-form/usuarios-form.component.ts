import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Usuario } from '../../models/Usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { UpdateDataService } from '../../services/updateData.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css']
})
export class UsuariosFormComponent implements OnInit {

  constructor(
    private _usuariosS: UsuariosService,
    public _uS: UpdateDataService
  ) {
    this.userEmail.pipe(
      debounceTime(800),
      distinctUntilChanged())
      .subscribe(value => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          this._usuariosS.checkEmail(value)
            .subscribe((resp) => {
              // console.log(resp)
              if (resp.exist) {
                this.errorEmail = true;
              } else {
                this.errorEmail = false;
              }
              if (this.form.value._id !== '') {
                this.errorEmail = false;
              }

            })
        } else {
          // console.log(false)
        }
      });
  }

  form: FormGroup;
  subscription: Subscription;
  addressLabel: any;
  telephoneLabel: any;
  emailLabel: any;
  nameLabel: any;
  lastnameLabel: any;
  passwordLabel: any;
  errorEmail: boolean = false;
  userEmail = new Subject<string>();

  ngOnInit() {
    this.initRegisterForm();

    // Create / Update Subscription
    this.subscription = this._uS.getUserId().subscribe(id => {
      this._usuariosS.obtenerUsuario(id).subscribe(r => {
        if (id !== '') {
          this.requiredPass(id);
          $('.client-action').text('Actualizar');
          // $('#userPassInput').hide();
          this.form.patchValue({
            address: r.address,
            cellPhone: r.cellPhone,
            email: r.email,
            firstName: r.firstName,
            lastName: r.lastName,
            password: r.password,
            _id: r._id
          })
          // if (id !== null) {
          //   this.form.controls['password'].setValidators(null);
          //   this.form.controls['password'].updateValueAndValidity();
          // }
        } else {
          // this.initRegisterForm()
          // this.form.controls['password'].setValidators([Validators.required]);
          // this.form.controls['password'].updateValueAndValidity();
          this.form.reset();
        }
      })
    })


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  crear() {
    if (this.form.value._id !== null) {
      this._usuariosS.actualizarUsuario(this.form.value._id, this.form.value).subscribe((r) => {
        this._usuariosS.notifica.emit({ render: true })
      });
    } else {

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
        this._usuariosS.notifica.emit({ render: true })
      });
    }
  }

  private initRegisterForm() {
    this.form = new FormGroup({
      address: new FormControl(null),
      cellPhone: new FormControl(null),
      email: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      img: new FormControl(null),
      _id: new FormControl(null)
    });
  }

  requiredPass(id: string) {
    return (id !== '') ? false : true;
  }
}
