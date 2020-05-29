import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  dtOptions: any;
  // dtTrigger: Subject<any> = new Subject();

  constructor() { }

  public config: PerfectScrollbarConfigInterface = {};

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      bInfo: false,
      paging: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar Users..."
      },
      initComplete: function () {
        $("#chat-users-tbl_filter").detach().appendTo('.chat-search-input');
      },
      scrollCollapse: true
    };
  }
}
