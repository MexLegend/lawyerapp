import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { EventEmitter } from 'events';
declare var $: any, M: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  public drop: boolean = true;
  dropdownActions;

  constructor(
    public _usuariosS: UsuariosService
  ) {
  }

  ngOnInit() {
    $(document).ready(function () {
      // Sinenav Inicialization
      $('.sidenav').sidenav();

      // Tooltip Inicialization
      $('.tooltipped').tooltip({
        enterDelay: 50,
        inDuration: 200,
        outDuration: 100,
        transitionMovement: 8,
        html: "<div class='arrow-tooltip'></div>"
      });

      // Dropdown Inicialization
      $(".dropdown-trigger").dropdown({
        coverTrigger: false,
        constrain_width: true,
        gutter: 0,
        belowOrigin: false
      });
      // Modal Incialization
      $('.modal').modal();
    })
  }
}
