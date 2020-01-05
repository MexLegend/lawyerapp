import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {

    $("#contact-sidenav .contact-list li").hover(function (e) {
      e.stopPropagation();
      if (!$(this).closest(".perfil-menu-option").hasClass("active")) {
        $(this).closest(".perfil-menu-option").addClass("perfil-menu-option-hover");
      }
    }, function () {
      $(this).closest(".perfil-menu-option").removeClass("perfil-menu-option-hover");
    });

    $("#contact-sidenav .contact-list li").click(function (e) {
      e.stopPropagation();
      if (!$(this).hasClass("sidebar-title")) {
        $("#contact-sidenav .contact-list li").removeClass("active");
        if (!$(this).closest(".perfil-menu-option").hasClass("active")) {
          $(this).addClass("active");
        }
      }
    });
  }

  public onScrollEvent(event: any): void {
    console.log(event);
  }

}
