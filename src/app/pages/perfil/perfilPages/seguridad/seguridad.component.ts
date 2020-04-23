import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UsersService } from '../../../../services/users.service';

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
    private _usersS: UsersService
  ) { }

  ngOnInit() {
  }

  update(f: NgForm) {

    const data = {
      passAct : f.value.passAct,
      passNew : f.value.passNew,
      passNewR : f.value.passNewR
    }

    this._usersS.updatePassword(this._usersS.user._id, data)
    .subscribe(resp => {
          if(resp.ok) {
            f.reset()
          }
        })
  }
}