import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @Input() public tForm: string;
  form: string = "";

  constructor() {}

  ngOnInit() {
    this.tForm = "login";
  }

  vForm(form: string) {
    this.tForm = form;
  }
}
