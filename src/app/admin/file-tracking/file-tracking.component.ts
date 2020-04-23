import { Component, OnInit } from '@angular/core';

import { UpdateDataService } from '../../services/updateData.service';
import { FilesService } from '../../services/files.service';

declare var $: any;

@Component({
  selector: 'app-file-tracking',
  templateUrl: './file-tracking.component.html',
  styleUrls: ['./file-tracking.component.css']
})
export class FileTrackingComponent implements OnInit {

  constructor(
    private _filesS: FilesService,
    private _updateDataS: UpdateDataService
  ) {}
  
  public fileData: any = "";
  public userData: any = "";

  ngOnInit() {

    // Get UserData Subscription
    this._updateDataS.getUserData('seguimiento').subscribe(data => {
      console.log('userD',data)
      this.userData = data
    });

    // Get FileData Subscription
    this._updateDataS.getFileData().subscribe(data => {
      console.log('FileD',data)
      this.fileData = data
    });

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

  send() {
    const volumes = {
      volume: '2'
    }
    this._filesS.updateFile(this.fileData._id, volumes)
        .subscribe((resp) => {
          console.log(resp)
        })
  }

  // Send Action to Update Data Service
  updateDataServiceAction() {
    this._updateDataS.dataServiceAction("seguimiento");
  }
}
