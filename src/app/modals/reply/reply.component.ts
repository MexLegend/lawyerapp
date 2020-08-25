import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {

  constructor() { }

  public config: PerfectScrollbarConfigInterface = {};
  form: FormGroup;

  ngOnInit() {
    this.initCommentForm();
  }

  private initCommentForm() {
    this.form = new FormGroup({
      comment: new FormControl(null, Validators.required),
      _id: new FormControl(null),
    });
  }
}
