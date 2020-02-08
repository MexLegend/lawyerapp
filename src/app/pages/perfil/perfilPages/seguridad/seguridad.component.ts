import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../../services/usuarios.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-seguridad',
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.css']
})
export class SeguridadComponent implements OnInit {

  passAct: string = '';
  passNew: string = '';
  passNewR: string = '';

  constructor(
    private _usuariosS: UsuariosService
  ) { }

  ngOnInit() {
  }

  actualizarPass(f: NgForm) {

    const data = {
      passAct : f.value.passAct,
      passNew : f.value.passNew,
      passNewR : f.value.passNewR
    }

    this._usuariosS.actualizarPassword(this._usuariosS.user._id, data)
    .subscribe(resp => {
          console.log(resp)
          if(resp) {
            f.reset()
          }
        })
  }

}
