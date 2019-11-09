import { Component, OnInit, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

declare var $: any, M: any, options: any, PerfectScrollbar: any, width: any, height: any, style: any, value: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public type: string = 'component';

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent, null) componentRef?: PerfectScrollbarComponent;
  

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
