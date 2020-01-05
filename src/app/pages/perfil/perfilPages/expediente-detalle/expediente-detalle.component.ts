import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '../../../../services/files.service';
import { Files } from '../../../../models/Files';

@Component({
  selector: 'app-expediente-detalle',
  templateUrl: './expediente-detalle.component.html',
  styleUrls: ['./expediente-detalle.component.css']
})
export class ExpedienteDetalleComponent implements OnInit {

  expediente: Files;

  constructor(
    private activatedRoute: ActivatedRoute,
    public _filesS: FilesService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe( params => {
      const id = params['id'];

      if ( id !== 'nuevo' ) {
        this.cargarExpediente( id );
      }
    })
  }

  cargarExpediente( id: string ) {
    this._filesS.obtenerExpediente(id)
      .subscribe( expediente => {
        this.expediente = expediente;
      })
  }

}
