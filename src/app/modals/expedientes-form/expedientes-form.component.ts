import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Files } from '../../models/Files';
import { FilesService } from '../../services/files.service';
import { Usuario } from '../../models/Usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { UpdateDataService } from '../../services/updateData.service';
import { Subscription } from 'rxjs';
import { ExpedientesComponent } from '../../admin/expedientes/expedientes.component';
declare var $: any;

@Component({
  selector: 'app-expedientes-form',
  templateUrl: './expedientes-form.component.html',
  styleUrls: ['./expedientes-form.component.css'],
  providers: [
    ExpedientesComponent
  ]
})
export class ExpedientesFormComponent implements OnInit {

  constructor(
    public _filesS: FilesService,
    public _usuariosS: UsuariosService,
    public _updateData: UpdateDataService,
    public expedientesC: ExpedientesComponent
  ) { }

  form: FormGroup;
  subscription: Subscription;
  usuarios: Usuario[];
  client: any;
  extKey: any;
  actor: any;
  defendant: any;
  third: any;
  affair: any;
  description: any;
  userData: any = '';
  nombre: any = '';

  ngOnInit() {

    // Get UserData Subscription
    this._updateData.getUserData('expediente').subscribe((data: any) => {
      this.userData = data;
      this.nombre = (data !== '') ? data.firstName + ' ' + data.lastName : '';
    });

    // Get User List Subscription
    this._usuariosS.obtenerUsuarios()
      .subscribe(usuarios => {
        this.usuarios = usuarios.docs;
      })

    this.initArticulosForm();

    // Create / Update Subscription
    this.subscription = this._updateData.getFileId().subscribe(id => {
      this._filesS.obtenerExpediente(id).subscribe(r => {
        if (id !== '') {
          $('.file-action').text('Actualizar');
          let nameClient = `${ r.assigned_client.firstName } ${ r.assigned_client.lastName }`;
          this.form.patchValue({
            assigned_client: nameClient,
            extKey: r.extKey,
            actor: r.actor,
            defendant: r.defendant,
            third: r.third,
            affair: r.affair,
            description: r.description,
            _id: r._id
          })
        } else {
          this.form.reset();
        }
      })
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  crear() {
    let extK = (this.form.value.extKey === '') ? 'N/E' : this.form.value.extKey;

    if (this.form.value._id !== null) {
      // Update File
      const file = new Files(
        this.form.value.actor,
        this.form.value.affair,
        this.userData._id,
        this.form.value.defendant,
        this.form.value.description,
        'ryghery8her89yr8',
        this.form.value.third,
        extK
        );
        
      this._filesS.actualizarExpediente(this.form.value._id, file).subscribe((r) => {
        this._filesS.notifica.emit({ render: true })
      });
    } else {
      // Create File

      const file = new Files(
        this.form.value.actor,
        this.form.value.affair,
        this.userData._id,
        this.form.value.defendant,
        this.form.value.description,
        'ryghery8her89yr8',
        this.form.value.third,
        extK
      );

      this._filesS.crearExpediente(file).subscribe(resp => {
        this.form.reset();
        this._filesS.notifica.emit({ render: true })
      })
    }
  }

  private initArticulosForm() {
    this.form = new FormGroup({
      actor: new FormControl(null, Validators.required),
      affair: new FormControl(null, Validators.required),
      assigned_client: new FormControl(null, Validators.required),
      defendant: new FormControl(null, Validators.required),
      description: new FormControl(null),
      third: new FormControl(null),
      extKey: new FormControl(null),
      _id: new FormControl(null)
    });
  }

  // Send Action to Update Data Service
  updateDataServiceAction() {
    this._updateData.dataServiceAction("expediente");
  }

}
