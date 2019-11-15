import { Component, OnInit, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

declare var $: any, M: any, options: any, PerfectScrollbar: any, width: any, height: any, style: any, value: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent, null) componentRef?: PerfectScrollbarComponent;

  constructor() { }

  ngOnInit() {
    $("#contact-sidenav .contact-list li").hover(function (e) {
      e.stopPropagation();
      if (!$(this).closest(".perfil-menu-option").hasClass("active")) {
        $(this).closest(".perfil-menu-option").addClass("perfil-menu-option-hover");
      }
    }, function () {
      $(this).closest(".perfil-menu-option").removeClass("perfil-menu-option-hover");
    });
  }

  public onScrollEvent(event: any): void {
    console.log(event);
  }

}
