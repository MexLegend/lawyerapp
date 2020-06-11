import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-be-prime',
  templateUrl: './be-prime.component.html',
  styleUrls: ['./be-prime.component.css']
})
export class BePrimeComponent implements OnInit {

  constructor() { }

  public config: PerfectScrollbarConfigInterface = {};

  ngOnInit() {    
  }
}
