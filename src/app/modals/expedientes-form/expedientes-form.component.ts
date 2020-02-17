import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Files } from '../../models/Files';
import { FilesService } from '../../services/files.service';
import { Usuario } from '../../models/Usuario';
import { UsuariosService } from '../../services/usuarios.service';
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
    // $('.modal').modal();
    $('select').formSelect();
  }

  private initArticulosForm() {
    this.form = new FormGroup({
      actor: new FormControl(null, Validators.required),
      affair: new FormControl(null, Validators.required),
      assigned_client: new FormControl(null, Validators.required),
      defendant: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      third: new FormControl(null, Validators.required),
      extKey: new FormControl(null)
    });
  }

  crear() {

    const file = new Files(
      this.form.value.actor,
      this.form.value.affair,
      this.form.value.assigned_client,
      this.form.value.defendant,
      this.form.value.description,
      'ryghery8her89yr8',
      this.form.value.third,
      this.form.value.extKey
    );

    this._filesS.crearExpediente(file).subscribe(resp => {
      this.form.reset();
    })
  }

  obtenerUsuarios() {

  }

}
