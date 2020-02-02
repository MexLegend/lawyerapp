import { Component, OnInit } from '@angular/core';
import { Files } from '../../models/Files';
import { Subject } from 'rxjs';
import { FilesService } from '../../services/files.service';
declare var $: any;

@Component({
  selector: 'app-seleccionar-expediente',
  templateUrl: './seleccionar-expediente.component.html',
  styleUrls: ['./seleccionar-expediente.component.css']
})
export class SeleccionarExpedienteComponent implements OnInit {

  expedientes: Files[] = [];
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();

  constructor(private _filesS: FilesService) { }

  ngOnInit() {
    this._filesS.obtenerExpedientes().subscribe(r => {
      this.expedientes = r.docs;
      this.dtTrigger.next();
    });
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 4,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        searchPlaceholder: "Buscar expedientes"
      }
    };
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
