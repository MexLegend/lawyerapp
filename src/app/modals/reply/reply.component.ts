import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { MAT_DIALOG_DATA } from "@angular/material";
import { User } from "../../models/User";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-reply",
  templateUrl: "./reply.component.html",
  styleUrls: ["./reply.component.css"],
})
export class ReplyComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _usersS: UsersService
  ) {}

  public config: PerfectScrollbarConfigInterface = {};
  form: FormGroup;
  to: User = null;
  action: string = null;

  ngOnInit() {
    this.initCommentForm();

    if (this.data) {
      this.to = this.data.user;
      this.action = this.data.action;
    }
  }

  private initCommentForm() {
    this.form = new FormGroup({
      comment: new FormControl(null, Validators.required),
      _id: new FormControl(null),
    });
  }
}
