import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-lawyer-contact',
  templateUrl: './lawyer-contact.component.html',
  styleUrls: ['./lawyer-contact.component.css']
})
export class LawyerContactComponent implements OnInit {

  panelOpenState = false;

  constructor() { }

  public config: PerfectScrollbarConfigInterface = {};

  ngOnInit() {
  }

}
