import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-seguimiento-expediente',
  templateUrl: './seguimiento-expediente.component.html',
  styleUrls: ['./seguimiento-expediente.component.css']
})
export class SeguimientoExpedienteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(function () {
      // Tabs Initiation
      $('.tabs').tabs();

      // Clients Modal Initiation
      $("#selectUser").modal();

      //  Files Modal Initiation
      $("#selectFile").modal();

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

}
