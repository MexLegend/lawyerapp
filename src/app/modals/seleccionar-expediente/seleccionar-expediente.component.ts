import { Component, OnInit } from '@angular/core';
import { Files } from '../../models/Files';
import { Subject } from 'rxjs';
import { FilesService } from '../../services/files.service';
import { UpdateDataService } from '../../services/updateData.service';
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
  isChecked: boolean = false;
  selectedRowData: any;
  fileData: any;

  constructor(private _filesS: FilesService, private _updateData: UpdateDataService) { }

  ngOnInit() {
    // Get Files Subscription
    this._filesS.obtenerExpedientes().subscribe(r => {
      this.expedientes = r.docs;
      this.dtTrigger.next();
    });

    // Set UserData Subscription
    this._updateData.getFileData().subscribe(data => this.fileData = data)

    // Change Datatable Options
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 4,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar expedientes"
      },
      autoWidth: true,
      "scrollY": "calc(100vh - 431px)",
      "scrollCollapse": true,
      initComplete: function () {
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

  // Enable Select Button On Checkbox Click And Get Data
  isCheckedFunction(data: any) {
    if (this.isChecked === false) {
      this.isChecked = true;
    }
    this.selectedRowData = data;
  }

  printData() {
    this._updateData.setFileData(this.selectedRowData);
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
