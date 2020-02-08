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
        "infoFiltered": "",
        searchPlaceholder: "Buscar expedientes"
      }, initComplete: function () {
        $("#select-files-tbl_filter").detach().appendTo('.buscadorAdminFiles');
      },
    };

    $(document).ready(function () {
      // Show/Hide Close Serach Box Button
      $(document).on("keyup", ".buscadorAdminFiles input", function () {
        if ($(this).val() !== '') {
          $(this).closest($(".buscadorAdminFiles")).find($('.filter-close')).css('display', "flex");
        } else {
          $(this).closest($(".buscadorAdminFiles")).find($('.filter-close')).css('display', "none");
        }
      })
      // Clear Serach Box On Close Button Click
      $(document).on("click", ".filter-close", function () {
        $(this).css('display', "none");
        $(this).closest($(".buscadorAdminFiles")).find($('.buscadorAdminFiles input')).val("");
        $("#select-files-tbl").DataTable().search("").draw();
      })
    });
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
