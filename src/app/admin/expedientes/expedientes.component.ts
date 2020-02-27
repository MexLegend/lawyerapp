import { Component, OnInit, ViewChild } from '@angular/core';
import { Files } from '../../models/Files';
import { FilesService } from '../../services/files.service';
import { UpdateDataService } from '../../services/updateData.service';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})
export class ExpedientesComponent implements OnInit {

  constructor(
    public _filesS: FilesService,
    public _upS: UpdateDataService
  ) { }

  expedientes: Files[] = [];
  
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  ngOnInit() {
    this._filesS.obtenerExpedientes().subscribe(r => {
      this.expedientes = r.docs;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      "destroy": true,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar expedientes"
      },
      scrollY: "calc(100vh - 431px)",
      scrollCollapse: true
    };

    this._filesS.notifica
        .subscribe(r => {
          this.cargarExpedientes();
          this.rerender()
        }
    )
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  cargarExpedientes() {
    this._filesS.obtenerExpedientes().subscribe(r => {
      this.expedientes = r.docs;
    })
  }

  borrarExpediente(expediente: Files) {
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar el expediente ' + expediente.affair,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
      .then((result) => {
        if (result.value) {
          this._filesS.eliminarExpediente(expediente._id).subscribe(borrado => {
            this.cargarExpedientes();
            this.rerender();
          })
        }
      })
  }

  sendId(id: string) {
    this._upS.sendFileId(id)
  }

  generarClave() {
    // Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
    const allNumbers = [..."0123456789"];

    const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];

    const generator = (base, len) => {
      return [...Array(len)]
        .map(i => base[Math.random() * base.length | 0])
        .join('');
    };

    document.getElementsByClassName("clave-generada")[0].innerHTML = generator(base, 12);

  }

  // Update Datatable data after content changes
  rerender(): void {    
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      
    });
  }

}
