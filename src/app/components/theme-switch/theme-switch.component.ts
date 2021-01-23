import { Component, OnInit } from "@angular/core";
import { ThemeService } from "../../services/theme.service";

@Component({
  selector: "app-theme-switch",
  templateUrl: "./theme-switch.component.html",
  styleUrls: ["./theme-switch.component.css"],
})
export class ThemeSwitchComponent implements OnInit {
  constructor(public _themeS: ThemeService) {}

  // Theme Variable
  public isDarkThemeActive: boolean = false;

  ngOnInit() {
    // Get Initial Theme From Local Storage
    this._themeS.seCurrentTheme("get").then((isDarkThemeActive) => {
      this.isDarkThemeActive = isDarkThemeActive;
    });

    // Get New Theme After Been Updated
    this._themeS.getSwitchValue().subscribe((isDarkThemeActive) => {
      this.isDarkThemeActive = isDarkThemeActive;
    });
  }

  // Change Theme Function
  changeTheme() {
    this._themeS.seCurrentTheme("update");
  }
}
