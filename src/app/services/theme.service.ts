import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, Subject } from "rxjs";

export const darkTheme = {
  // Backgrounds
  "action-btn-bg": "#333333",
  "alpha-medium-dark-bg": "#212121ed",
  "alpha-dark-bg": "#212121f8",
  "dark-smoke-bg": "#181818",
  "light-dark-bg": "#909090",
  "medium-dark-bg": "#212121",
  "dark-bg": "#121212",
  "dark-bg-odd": "rgba(99, 99, 99, 0.13)",
  "dark-modal-footer": "#191919fc",
  "light-blue-bg": "#2196f3",
  "gradient-light-blue-bg": "linear-gradient(45deg, #0288d1, #26c6da)",
  "admin-modal-button-bg": "linear-gradient(45deg, #303f9f, #1976d2)",
  "perfil-modal-button-bg": "linear-gradient(45deg, #243393, #1976d2)",
  "transparent-bg": "transparent",
  "message-button-bg": "rgba(255, 255, 255, 0.1)",
  "tabs-bg": "rgba(255, 255, 255, 0.1)",
  "whatsApp-bg": "#393939",
  "main-sidebar-bg": "#212121",
  "attached-file-bg": "rgba(214, 214, 214, 0.1)",
  "attached-file-btn-bg": "rgba(255, 255, 255, 0.1)",
  "attached-file-comment": "rgba(255, 255, 255, 0.1)",
  "nav-fixed-option-bg": "rgba(255,255,255,.1",
  "status-bg": "rgba(255, 255, 255, 0.3)",
  "tracking-number-bg": "rgba(255, 255, 255, 0.3)",
  "tooltip-background": "rgba(255, 255, 255, 0.8)",
  "switch-bg": "#1e88e5",
  "filters-container-bg": "#393939",
  "save-changes-bg": "#5f5f5fa1",
  "search-input-filter-bg": "#212121",
  "chat-message-bg": "#3e4042",
  "evidence-box": "#666",
  "evidence-box-header": "#605e5e",
  "container-bg": "#212121",
  "watch-item-bg": "#4d4d4d",
  "upload-profile-img-bg": "rgba(255,255,255,0.6)",
  // Colors
  "white-color": "#ffffff",
  "alpha-white-color": "rgba(255, 255, 255, 0.8)",
  "light-gray": "#909090",
  "medium-gray": "#80868b",
  "dark-gray": "#212121",
  "dark-disabled-button-color": "#aaa",
  "light-blue-color": "#2196f3",
  "medium-blue-color": "#26aee4",
  "default-color": "#e4e6eb",
  "default-hover-color": "#ffffff",
  "active-admin-sidenav-color": "#ffffff",
  "hover-admin-sidenav-color": "#212121",
  "titles-color": "#ffffff",
  "admin-modal-button-color": "#ffffff",
  "perfil-modal-button-color": "#ffffff",
  "user-rol-color": "#aaa",
  "message-button-color": "#aaa",
  "favorite-time-color": "#aaa",
  "sidebar-li-active": "#ffffff",
  "last-articles-color": "#9d9d9d",
  "attached-file-btn-color": "white",
  "search-button-color": "rgba(255, 255, 255, 0.7)",
  "primary-text": "#e4e6eb",
  "save-changes-color": "rgba(0, 0, 0, 0.42)",
  "secondary-text": "#b0b3b8",
  "third-text": "#e4e6eb",
  "tooltip-color": "rgba(0, 0, 0, 0.8)",
  // Borders
  "medium-dark-border": "#212121",
  "dark-border": "#303030",
  "dark-bottom-border": "#3e3e3e",
  "dark-top-border": "#3e3e3e",
  "dark-right-border": "#3e3e3e",
  "transparent-border": "transparent",
  "admin-modal-button-border": "none",
  "perfil-modal-button-border": "none",
  "lawyer-modal-border-color": "rgba(255, 255, 255, 0.05)",
  "search-button-border": "#545252",
  "img-border": "rgba(255, 255, 255, 0.05)",
  "cancel-modal-border": "none",
  "search-input-border": "#4e4e4e",
  "sidenav-divider-border-color": "#605e5e",
  // Box Shadow
  "dark-box-shadow": "0 0 4px 2px #3030304d",
  "dark-box-shadow-color": "rgba(0, 0, 0, 0.3)",
  "none-box-shadow": "none",
  // Divider
  "dark-divider": "#444444",
  // Hover / Active Backgrounds
  "light-dark-bg-hover": "rgba(255, 255, 255, 0.1)",
  "medium-dark-bg-hover": "#393939",
  "dark-bg-odd-hover": "rgba(214, 214, 214, 0.1)",
  "sidebar-li-hover": "rgba(255, 255, 255, 0.1)",
  "nav-fixed-option-bg-hover": "rgba(255,255,255,0.1)",
  "nav-fixed-option-bg-extended": "rgba(255,255,255,0.1)",
  "comments-bg-hover": "rgba(255, 255, 255, 0.1)",
  // Disabled
  "dark-disabled-button-bg": "rgba(255, 255, 255, 0.1)",
  "dark-disabled-button-bg-after": "#383838",
  "dark-disabled-button-bg-before": "#383838",
  "modal-disabled-button-bg": "rgba(255, 255, 255, 0.1)",
  // Transitions
  "background-transition": "background-color 5000s ease-in-out 0s",
};

export const lightTheme = {
  // Backgrounds
  "action-btn-bg": "#f9f9f9",
  "alpha-medium-dark-bg": "#ffffffeb",
  "alpha-dark-bg": "#f5f5f5",
  "dark-smoke-bg": "white",
  "light-dark-bg": "",
  "medium-dark-bg": "white",
  "dark-bg": "white",
  "dark-bg-odd": "#f9f9f9",
  "dark-modal-footer": "#fafafa",
  "light-blue-bg": "",
  "gradient-light-blue-bg": "#d9f6ff",
  "admin-modal-button-bg": "#ffffff",
  "perfil-modal-button-bg": "#ffffff",
  "transparent-bg": "transparent",
  "message-button-bg": "#eceff1",
  "tabs-bg": "rgb(244, 244, 244)",
  "whatsApp-bg": "#ffffff",
  "main-sidebar-bg": "linear-gradient(45deg, #0288d1, #26c6da)",
  "attached-file-bg": "rgba(0, 0, 0, 0.1)",
  "attached-file-btn-bg": "transparent",
  "attached-file-comment": "rgba(0, 0, 0, 0.1)",
  "nav-fixed-option-bg": "#e4e6eb",
  "status-bg": "rgba(0, 0, 0, 0.3)",
  "tracking-number-bg": "#1976d2",
  "tooltip-background": "rgba(0, 0, 0, 0.8)",
  "switch-bg": "#a7a7a7",
  "filters-container-bg": "#f9f9f9",
  "save-changes-bg": "#5f5f5f52",
  "search-input-filter-bg": "#f9f9f9",
  "chat-message-bg": "#e4e6eb",
  "evidence-box": "#757575",
  "evidence-box-header": "#eee",
  "container-bg": "#ffffff",
  "watch-item-bg": "#d9d9d9",
  "upload-profile-img-bg": "rgba(0, 0, 0, 0.7)",
  // Colors
  "white-color": "#ffffff",
  "alpha-white-color": "rgba(0, 0, 0, 0.85)",
  "light-gray": "rgba(0, 0, 0, 0.7)",
  "medium-gray": "rgba(0, 0, 0, 0.85)",
  "dark-gray": "",
  "dark-disabled-button-color": "rgba(0, 0, 0, 0.3)",
  "light-blue-color": "",
  "medium-blue-color": "",
  "default-color": "rgba(0,0,0,0.87)",
  "default-hover-color": "#383838",
  "active-admin-sidenav-color": "#ffffff",
  "hover-admin-sidenav-color": "#ffffff",
  "titles-color": "#757575",
  "admin-modal-button-color": "#303f9f",
  "perfil-modal-button-color": "#303f9f",
  "user-rol-color": "#616161",
  "message-button-color": "rgba(0, 0, 0, 0.85)",
  "favorite-time-color": "#6b6f82",
  "sidebar-li-active": "#08b0ec",
  "last-articles-color": "#606060",
  "attached-file-btn-color": "#3949ab",
  "search-button-color": "#606060",
  "primary-text": "#050505",
  "save-changes-color": "rgba(0, 0, 0, 0.33)",
  "secondary-text": "#65676b",
  "third-text": "#65676b",
  "tooltip-color": "rgba(255, 255, 255, 0.8)",
  // Borders
  "medium-dark-border": "#ddd",
  "dark-border": "rgb(211, 211, 211)",
  "dark-bottom-border": "#e0e0e0",
  "dark-top-border": "#e0e0e0",
  "dark-right-border": "#e0e0e0",
  "transparent-border": "inherit",
  "admin-modal-button-border": "#303f9f",
  "perfil-modal-button-border": "#303f9f",
  "lawyer-modal-border-color": "rgb(0 0 0 / 10%)",
  "search-button-border": "#9c9c9c",
  "img-border": "rgba(0, 0, 0, 0.05)",
  "cancel-modal-border": "3px solid",
  "search-input-border": "#ddd",
  "sidenav-divider-border-color": "#d0d0d0",
  // Box Shadow
  "dark-box-shadow": "0 0 4px 2px rgba(0, 0, 0, 0.1)",
  "dark-box-shadow-color": "",
  "none-box-shadow": "inset 0px 0px 6px 0px #f2f2f2",
  // Divider
  "dark-divider": "#e0e0e0",
  // Hover / Active Backgrounds
  "light-dark-bg-hover": "#eee",
  "medium-dark-bg-hover": "#eee",
  "dark-bg-odd-hover": "#f6f6f6",
  "sidebar-li-hover": "rgba(0,0,0,0.05)",
  "nav-fixed-option-bg-hover": "rgba(0,0,0,0.15)",
  "nav-fixed-option-bg-extended": "#e7f3ff",
  "comments-bg-hover": "#d9d9d9",
  // Disabled
  "dark-disabled-button-bg": "rgba(255, 255, 255, 1)",
  "dark-disabled-button-bg-after": "#ffffff",
  "dark-disabled-button-bg-before": "#f0f0f0",
  "modal-disabled-button-bg": "rgba(0, 0, 0, 0.09)",
  // Transitions
  "background-transition": "",
};

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private isSwitchChecked = new Subject<any>();
  private isDarkThemeActive: boolean = false;

  // Set Theme To Current Local Storage One Or Update To New One
  async seCurrentTheme(action: string): Promise<boolean> {
    if (action === "get") {
      if (JSON.parse(localStorage.getItem("dark"))) {
        this.isDarkThemeActive = true;
        this.toggleDark();
      } else {
        this.isDarkThemeActive = false;
        this.toggleLight();
      }
    } else {
      if (!this.isDarkThemeActive) {
        this.isDarkThemeActive = true;
        this.setSwitchValue(true);
        this.toggleDark();
      } else {
        this.isDarkThemeActive = false;
        this.setSwitchValue(false);
        this.toggleLight();
      }
    }

    return new Promise((resolve, reject) => resolve(this.isDarkThemeActive));
  }

  getSwitchValue(): Observable<boolean> {
    return this.isSwitchChecked.asObservable();
  }

  resetDefaultTheme() {
    Object.keys(lightTheme).forEach((k) =>
      document.documentElement.style.setProperty(`--${k}`, lightTheme[k])
    );
  }

  setSwitchValue(value: boolean) {
    this.isSwitchChecked.next(value);
  }

  // Set Style Properties Colors From Root To Active Theme
  setTheme(theme: {}) {
    Object.keys(theme).forEach((k) =>
      document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  }

  // Set Local Storage Properties To Dark Theme
  toggleDark() {
    localStorage.setItem("theme", JSON.stringify(darkTheme));
    localStorage.setItem("dark", "true");
    this.setTheme(darkTheme);
  }

  // Set Local Storage Properties To Light Theme
  toggleLight() {
    localStorage.setItem("theme", JSON.stringify(lightTheme));
    localStorage.setItem("dark", "false");
    this.setTheme(lightTheme);
  }
}
