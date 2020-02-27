import { Component, OnInit, ViewChild } from '@angular/core';
import { Articulo } from '../../models/Articulo';
import { Subject } from 'rxjs';
import { ArticulosService } from '../../services/articulos.service';
import { UpdateDataService } from '../../services/updateData.service';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
declare var $: any;

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})
export class ArticulosComponent implements OnInit {

  constructor(
    private _articulosS: ArticulosService,
    public _upS: UpdateDataService
  ) { }

  articulos: Articulo[] = [];

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  ngOnInit() {
    this._articulosS.obtenerArticulos().subscribe(r => {
      this.articulos = r.docs;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar articulos"
      },
      scrollY: "calc(100vh - 431px)",
      scrollCollapse: true

    }

    this._articulosS.notifica
      .subscribe(r => {
        this.cargarArticulos();
        this.rerender()
      }
      )
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  cargarArticulos() {
    this._articulosS.obtenerArticulos().subscribe(r => {
      this.articulos = r.docs;
    })
  }

  borrarArticulo(articulo: Articulo) {
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar el artículo ' + articulo.title,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
      .then((result) => {
        if (result.value) {
          this._articulosS.eliminarArticulo(articulo._id).subscribe(borrado => {
            this.cargarArticulos();
            this.rerender();
          })
        }
      })
  }

  sendId(id: string) {
    this._upS.sendArticleId(id)
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
