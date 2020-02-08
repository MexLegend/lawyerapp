import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

  dtOptions: any;
  // dtTrigger: Subject<any> = new Subject();

  constructor() { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      responsive: true,
      lengthChange: false,
      bInfo: false,
      paging: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar usuarios..."
      },
      initComplete: function () {
        $("#chat-users-tbl_filter").detach().appendTo('.chat-search-input');
      },
      scrollCollapse: true,
      fixedColumns: true
    };
  }
}
