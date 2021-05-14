import { Component, OnInit } from "@angular/core";
import { ThemeService } from "../../services/theme.service";
import { Subscription } from "rxjs";

import { MatDialogRef } from "@angular/material";
import { FormControl } from "@angular/forms";
import { ModalAlertService } from "../../services/modal-alert.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  constructor(
    public _themeS: ThemeService,
    private _modalAlertS: ModalAlertService
  ) {}

  subscriptionsArray: Subscription[] = [];

  form: string = "";
  isDarkThemeActive: boolean = false;
  modalRef: MatDialogRef<LoginComponent> = null;
  selected = new FormControl(0);

  ngOnInit() {
    // Get Initial Theme From Local Storage
    this._themeS.seCurrentTheme("get").then((isDarkThemeActive) => {
      this.isDarkThemeActive = isDarkThemeActive;
    });

    // Get New Theme After Been Updated
    this.subscriptionsArray.push(
      this._themeS.getSwitchValue().subscribe((isDarkThemeActive) => {
        this.isDarkThemeActive = isDarkThemeActive;
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  hideServerAlerts() {
    this._modalAlertS.setServerAlerts(false, "", "");
  }
}
