import { Component, OnInit, ViewChild } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public type: string = 'component';

  constructor() { }

  ngOnInit() {

    $(document).ready(function () {
      $('.sidenav').sidenav();
    });
  }

  public onScrollEvent(event: any): void {
    console.log(event);
  }

}
