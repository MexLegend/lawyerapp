import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    $('.sidenav').sidenav();
    $('.tooltipped').tooltip({
      enterDelay: 50,
      inDuration: 200,
      outDuration: 100,
      transitionMovement: 8,
      html: "<div class='arrow-tooltip'></div>"
    });
  }

}
