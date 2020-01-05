import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { UsuariosService } from '../../../../services/usuarios.service';

@Component({
  selector: 'app-conf-general',
  templateUrl: './conf-general.component.html',
  styleUrls: ['./conf-general.component.css']
})
export class ConfGeneralComponent implements OnInit {

  usuario: Usuario;

  constructor(
    public _usuarioS: UsuariosService
  ) {
    this.usuario = this._usuarioS.user;
  }

  ngOnInit() {
  }

  actualizar(usuario: Usuario) {
    // console.log(usuario)
    this.usuario.address = usuario.address;
    this.usuario.cellPhone = usuario.cellPhone;
    this.usuario.email = usuario.email;
    this.usuario.firstName = usuario.firstName;
    this.usuario.lastName = usuario.lastName;

    this._usuarioS.actualizarUsuario(this.usuario._id, this.usuario)
        .subscribe(console.log);
  }

}
