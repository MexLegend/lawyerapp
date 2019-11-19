import { Component, OnInit, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { UsuariosService } from '../services/usuarios.service';

declare var $: any, M: any, options: any, PerfectScrollbar: any, width: any, height: any, style: any, value: any;


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public type: string = 'component';

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent, null) componentRef?: PerfectScrollbarComponent;


  constructor(
    public _usuariosS: UsuariosService
  ) { }

  ngOnInit() {

    $(document).ready(function () {
      $('.sidenav').sidenav();
      $('.modal').modal();
    });
  }

  public onScrollEvent(event: any): void {
    console.log(event);
  }
}
