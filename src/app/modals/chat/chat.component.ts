import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor() { }

  selectedTab = new FormControl(0);
  selectedClientIndex: any;
  public config: PerfectScrollbarConfigInterface = {};

  ngOnInit() {
  }

}
