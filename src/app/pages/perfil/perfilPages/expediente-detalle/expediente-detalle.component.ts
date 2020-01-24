import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '../../../../services/files.service';
import { Subject } from 'rxjs/internal/Subject';
import { Files } from '../../../../models/Files';

@Component({
  selector: 'app-expediente-detalle',
  templateUrl: './expediente-detalle.component.html',
  styleUrls: ['./expediente-detalle.component.css']
})
export class ExpedienteDetalleComponent implements OnInit {

  expediente: Files;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    public _filesS: FilesService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.dtTrigger.next();
      if (id !== 'nuevo') {
        this.cargarExpediente(id);
      }
    })

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 1,
      responsive: true,
      lengthChange: false,
      "bFilter": false,
      scrollCollapse: true,
      fixedColumns: true
    };
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  cargarExpediente(id: string) {
    this._filesS.obtenerExpediente(id)
      .subscribe(expediente => {
        this.expediente = expediente;
      })
  }

}
