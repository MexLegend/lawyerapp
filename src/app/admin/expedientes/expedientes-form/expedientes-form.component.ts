import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Files } from '../../../models/Files';
import { FilesService } from '../../../services/files.service';
import { Usuario } from '../../../models/Usuario';
import { UsuariosService } from '../../../services/usuarios.service';
declare var $: any;

@Component({
  selector: 'app-expedientes-form',
  templateUrl: './expedientes-form.component.html',
  styleUrls: ['./expedientes-form.component.css']
})
export class ExpedientesFormComponent implements OnInit {

  form: FormGroup;
  usuarios: Usuario[];

  constructor(
    public _filesS: FilesService,
    public _usuariosS: UsuariosService
  ) { }

  ngOnInit() {
    this._usuariosS.obtenerUsuarios()
      .subscribe(usuarios => {
        this.usuarios = usuarios.docs;
      })
    this.initArticulosForm();
    $('.modal').modal();
    $('select').formSelect();
  }

  private initArticulosForm() {
    this.form = new FormGroup({
      assigned_client: new FormControl(null, Validators.required),
      affair: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      key: new FormControl(null)
    });
  }

  crear() {

    const file = new Files(
      this.form.value.assigned_client,
      this.form.value.affair,
      this.form.value.description,
      'ryghery8her89yr8'
    );

    this._filesS.crearExpediente(file).subscribe(resp => {
      this.form.reset();
    })
  }
  
  obtenerUsuarios() {

  }

}
