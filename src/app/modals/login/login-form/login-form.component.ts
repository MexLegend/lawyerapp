import { Component, OnInit, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { User } from "../../../models/User";
import { UsersService } from "../../../services/users.service";
import { Subscription } from "rxjs";
import { WebPushNotificationsService } from "../../../services/webPushNotifications.service";
import { MatDialogRef } from "@angular/material";
import { LoginComponent } from "../login.component";

declare var $: any;

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.css"],
})
export class LoginFormComponent implements OnInit {
  constructor(
    private router: Router,
    private _usersS: UsersService,
    private _webPushNotificationsS: WebPushNotificationsService
  ) {}

  @Input() public modalRef: MatDialogRef<LoginComponent> = null;

  subscriptionsArray: Subscription[] = [];

  email: string;
  password: string = "";
  remember = false;

  ngOnInit() {
    this.email = localStorage.getItem("email") || "";
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  logIn(form: NgForm) {
    const user = new User(form.value.email, null, null, form.value.password);

    this.subscriptionsArray.push(
      this._usersS.login(user, true).subscribe((resp) => {
        this._webPushNotificationsS.loginSocket(resp.user, resp.user.rooms);

        if (
          this._usersS.user.role === "ADMIN" ||
          this._usersS.user.role === "ASSOCIATED"
        ) {
          this.router.navigate(["/dashboard"]);
          if ($(".sidenav-overlay").css("display", "block")) {
            $(".sidenav-overlay").css("display", "none");
          }
        } else if (this._usersS.user.role === "USER") {
          this.router.navigate(["/perfil"]);
        }
        this.password = "";

        this.modalRef.close();
      })
    );
  }
}
