import { Component, OnInit, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { User } from "../../../models/User";
import { UsersService } from "../../../services/users.service";
import { Subscription } from "rxjs";
import { WebPushNotificationsService } from "../../../services/webPushNotifications.service";
import { MatDialogRef, MatTabGroup } from "@angular/material";
import { LoginComponent } from "../login.component";
import { UtilitiesService } from "../../../services/utilities.service";
import { ModalAlertService } from "../../../services/modal-alert.service";
import { Contact } from "src/app/models/Contact";
import { ContactService } from "../../../services/contact.service";

declare var $: any;

interface serverAlert {
  show: boolean;
  type: string;
  message: string;
}

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.css"],
})
export class LoginFormComponent implements OnInit {
  constructor(
    private _contactS: ContactService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    private _modalAlertS: ModalAlertService,
    private router: Router,
    private _usersS: UsersService,
    private _utilitiesS: UtilitiesService,
    private _webPushNotificationsS: WebPushNotificationsService
  ) {}

  @Input() public modalRef: MatDialogRef<LoginComponent> = null;
  @Input() public loginTabGroup: MatTabGroup = null;

  serverAlert: serverAlert = { show: false, type: "", message: "" };

  subscriptionsArray: Subscription[] = [];

  email: string;
  password: string = "";
  remember = false;
  respUserData: any = null;

  ngOnInit() {
    this.email = localStorage.getItem("email") || "";

    // Listen To Server Alerts
    this.subscriptionsArray.push(
      this._modalAlertS.getServerAlerts().subscribe(([show, type, message]) => {
        this.serverAlert = {
          show: show,
          type: type,
          message: message,
        };
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  logIn(form: NgForm) {
    const user = new User(form.value.email, null, null, form.value.password);

    this.subscriptionsArray.push(
      this._usersS.login(user, true).subscribe((resp) => {
        if (resp.ok) {
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
        } else {
          this.setServerAlertData(resp.type);
          this.respUserData = resp.user;
        }
      })
    );
  }

  resentConfirmationEmail(form: NgForm) {
    const email = new Contact(
      null,
      form.value.email,
      null,
      null,
      "Verificar cuenta de Haizen",
      "Fernando Romo Rodríguez",
      null
    );

    const sendEmailSub = this._contactS
      .enviarEmail(
        { ...email, id: this.respUserData._id },
        "confirmAccount",
        this.dialogRef
      )
      .subscribe(() => sendEmailSub.unsubscribe());
  }

  setServerAlertData(type: string) {
    switch (type) {
      case "notExist":
        this._modalAlertS.setServerAlerts(
          true,
          type,
          "Este correo no está registrado."
        );
        break;
      case "notConfirmed":
        this._modalAlertS.setServerAlerts(
          true,
          type,
          "Tu correo electrónico no ha sido confirmado. Por favor haz clic en el link que te enviamos."
        );
        break;
      default:
        this._modalAlertS.setServerAlerts(
          true,
          type,
          "Credenciales incorrectas. Inténtalo de nuevo."
        );
        break;
    }
  }

  setActiveTab() {
    this._utilitiesS.setActiveTab(this.loginTabGroup, 1);
  }
}
