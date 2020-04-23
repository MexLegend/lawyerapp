import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { UsersService } from '../../services/users.service';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  constructor(
    public router: Router,
    public _usersS: UsersService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actSt = this.router.url;
      }
    })
  }

  actSt: any = '';
  public drop: boolean = true;
  tFo: string = '';

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

  form(tF: string) {
    this.tFo = tF;
  }

  // Scroll to Top Function
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}