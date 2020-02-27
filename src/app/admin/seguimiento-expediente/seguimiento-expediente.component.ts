import { Component, OnInit } from '@angular/core';
import { UpdateDataService } from '../../services/updateData.service';

declare var $: any, M: any;

@Component({
  selector: 'app-seguimiento-expediente',
  templateUrl: './seguimiento-expediente.component.html',
  styleUrls: ['./seguimiento-expediente.component.css']
})
export class SeguimientoExpedienteComponent implements OnInit {

  public userData: any = "";
  public fileData: any = "";

  constructor(private _updateData: UpdateDataService) { }

  ngOnInit() {

    // Get UserData Subscription
    this._updateData.getUserData('seguimiento').subscribe(data => this.userData = data);

    // Get FileData Subscription
    this._updateData.getFileData().subscribe(data => this.fileData = data);

    $(document).ready(function () {
      // Tabs Initiation
      $('.tabs').tabs();

      // Clients Modal Initiation
      $("#selectUser").modal({
        onOpenEnd: function () {
          var table = $('#select-users-tbl').DataTable();
          table.columns.adjust().draw();
        }
      });

      //  Files Modal Initiation
      $("#selectFile").modal({
        onOpenEnd: function () {
          var table = $('#select-files-tbl').DataTable();
          table.columns.adjust().draw();
        }
      });

      // Maximum Files Selected
      // $(".upload-file-input").change(function () {
      //   if (this.files.length > 0) {
      //     if (this.files.length == 1) {
      //       $(".expediente-file-path").text(this.files[0].name);
      //     } else if (this.files.length == 2) {
      //       $(".expediente-file-path").text("2 archivos seleccionados");
      //     } else if (this.files.length == 3) {
      //       $(".expediente-file-path").text("3 archivos seleccionados");
      //     } else {
      //       $(".expediente-file-path").text("Ningún archivo seleccionado...");
      //       alert('Número máximo de archivos superado');
      //       this.value = '';
      //     }
      //   } else {
      //     $(".expediente-file-path").text("Ningún archivo seleccionado...");
      //   }
      // });
    });
  }

  // Send Action to Update Data Service
  updateDataServiceAction() {
    this._updateData.dataServiceAction("seguimiento");
  }
}
