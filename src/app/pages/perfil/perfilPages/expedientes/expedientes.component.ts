import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

import { Files } from '../../../../models/Files';
import { FilesService } from '../../../../services/files.service';

declare var $: any;

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})
export class ExpedientesComponent implements OnInit {

  files: Files[];
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private router: Router,
    public _filesS: FilesService
  ) { }

  ngOnInit() {

    this._filesS.getFiles()
      .subscribe((resp) => {
        this.files = resp.docs;
        this.dtTrigger.next();
      })

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 5,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        searchPlaceholder: "Buscar expedientes.."
      },
      initComplete: function () {
        $(".dataTables_filter").detach().appendTo('.buscadorExpediente');
      },
      scrollCollapse: true,
      fixedColumns: true
    };

    $(document).ready(function () {
      // Show/Hide Close Serach Box Button
      $(document).on("keyup", ".buscadorExpediente .dataTables_filter label input", function () {
        if ($(this).val() !== '') {
          $(this).closest($(".buscadorExpediente")).find($('.filter-close')).css('display', "flex");
        } else {
          $(this).closest($(".buscadorExpediente")).find($('.filter-close')).css('display', "none");
        }
      })
      // Clear Serach Box On Close Button Click
      $(document).on("click", ".filter-close", function () {
        $(this).css('display', "none");
        $(this).closest($(".buscadorExpediente")).find($('.buscadorExpediente .dataTables_filter label input')).val("");
        $(".notification-table").DataTable().search("").draw(); 
      })
    });

    // External Datatable Filter Box
    // $(document).ready(function () {
    //   $('#searchExpediente').on('keyup click', function () {
    //     $('.notification-table').DataTable().search(
    //       $('#searchExpediente').val()
    //     ).draw();
    //   });
    // })
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }


  goToFile(route: any) {
    const url = `/perfil/expediente-detalle/${ route }`;
    this.router.navigateByUrl(url)
  }

}
