import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, Subject } from "rxjs";

export const darkTheme = {
  // Backgrounds
  "acordion-indicator": " rgba(255, 255, 255, 0.2)",
  "action-btn-bg": "#333333",
  "admin-modal-button-bg": "linear-gradient(45deg, #303f9f, #2e89ff)",
  "attached-file-bg": "rgba(214, 214, 214, 0.1)",
  "alpha-dark-bg": "#212121f8",
  "alpha-medium-dark-bg": "#212121ed",
  "alpha-bg": "rgba(0, 0, 0, 0)",
  "attached-file-btn-bg": "rgba(255, 255, 255, 0.1)",
  "attached-file-comment": "rgba(255, 255, 255, 0.1)",
  "chat-message-bg": "#3e4042",
  "container-bg": "#212121",
  "dark-bg": "#121212",
  "dark-bg-odd": "rgba(99, 99, 99, 0.13)",
  "dark-modal-footer": "#191919fc",
  "dark-smoke-bg": "#181818",
  "evidence-box": "#666",
  "evidence-box-header": "#605e5e",
  "filters-container-bg": "#393939",
  "gradient-light-blue-bg": "linear-gradient(45deg, #0288d1, #26c6da)",
  "light-blue-bg": "#2196f3",
  "light-dark-bg": "#909090",
  "loading-data-bg": "#757575",
  "main-sidebar-bg": "#212121",
  "medium-dark-bg": "#212121",
  "message-button-bg": "rgba(255, 255, 255, 0.1)",
  "nav-fixed-option-bg": "rgba(255,255,255,.1",
  "perfil-modal-button-bg": "linear-gradient(45deg, #243393, #2e89ff)",
  "save-changes-bg": "#5f5f5fa1",
  "search-input-filter-bg": "#212121",
  "scrollbar-bg": "#0a0e13",
  "status-bg": "rgba(255, 255, 255, 0.3)",
  "switch-bg": "#2e89ff",
  "tab-bg": "rgb(255 255 255 / 10%)",
  "tabs-bg": "rgba(255, 255, 255, 0.1)",
  "tooltip-background": "rgba(255, 255, 255, 0.8)",
  "tracking-number-bg": "rgba(255, 255, 255, 0.3)",
  "transparent-bg": "transparent",
  "upload-profile-img-bg": "rgba(255,255,255,0.6)",
  "watch-item-bg": "#4d4d4d",
  "whatsApp-bg": "#393939",
  // Colors
  "active-admin-sidenav-color": "#ffffff",
  "admin-modal-button-color": "#ffffff",
  "alpha-white-color": "rgba(255, 255, 255, 0.8)",
  "attached-file-btn-color": "white",
  "blockquote-color": "#ffffff30",
  "dark-disabled-button-color": "#aaa",
  "dark-gray": "#212121",
  "default-color": "#e4e6eb",
  "default-hover-color": "#ffffff",
  "favorite-time-color": "#aaa",
  "hover-admin-sidenav-color": "#212121",
  "last-articles-color": "#9d9d9d",
  "light-blue-color": "#2196f3",
  "light-gray": "#909090",
  "medium-blue-color": "#26aee4",
  "medium-gray": "#80868b",
  "message-button-color": "#aaa",
  "perfil-modal-button-color": "#ffffff",
  "primary-text": "#e4e6eb",
  "save-changes-color": "rgba(0, 0, 0, 0.42)",
  "search-button-color": "rgba(255, 255, 255, 0.7)",
  "secondary-text": "#b0b3b8",
  "sidebar-li-active": "#ffffff",
  "third-text": "#e4e6eb",
  "titles-color": "#ffffff",
  "tooltip-color": "rgba(0, 0, 0, 0.8)",
  "user-rol-color": "#aaa",
  "white-color": "#ffffff",
  // Borders
  "admin-modal-button-border": "none",
  "cancel-modal-border": "none",
  "dark-border": "#303030",
  "dark-bottom-border": "#3e3e3e",
  "dark-top-border": "#3e3e3e",
  "dark-right-border": "#3e3e3e",
  "img-border": "rgba(255, 255, 255, 0.05)",
  "lawyer-modal-border-color": "rgba(255, 255, 255, 0.05)",
  "medium-dark-border": "#212121",
  "perfil-modal-button-border": "none",
  "search-button-border": "#545252",
  "search-input-border": "#4e4e4e",
  "sidenav-divider-border-color": "#605e5e",
  "transparent-border": "transparent",
  // Box Shadow
  "dark-box-shadow": "0 0 4px 2px #3030304d",
  "dark-box-shadow-color": "rgba(0, 0, 0, 0.3)",
  "none-box-shadow": "none",
  // Divider
  "dark-divider": "#444444",
  // Hover / Active Backgrounds
  "comments-bg-hover": "rgba(255, 255, 255, 0.1)",
  "dark-bg-odd-hover": "rgba(214, 214, 214, 0.1)",
  "light-dark-bg-hover": "rgba(255, 255, 255, 0.1)",
  "nav-fixed-option-bg-hover": "rgba(255,255,255,0.1)",
  "nav-fixed-option-bg-extended": "rgba(255,255,255,0.1)",
  "medium-dark-bg-hover": "#393939",
  "sidebar-li-hover": "rgba(255, 255, 255, 0.1)",
  "tab-bg-hover": "rgb(255 255 255 / 30%)",
  // Disabled
  "dark-disabled-button-bg": "rgba(255, 255, 255, 0.1)",
  "dark-disabled-button-bg-after": "#383838",
  "dark-disabled-button-bg-before": "#383838",
  "disabled-input-bg": "#2a2929",
  "modal-disabled-button-bg": "rgba(255, 255, 255, 0.1)",
  // Transitions
  "background-transition": "background-color 5000s ease-in-out 0s",
};

export const lightTheme = {
  // Backgrounds
  "acordion-indicator": "#1f1f1f5c",
  "action-btn-bg": "#f9f9f9",
  "admin-modal-button-bg": "#ffffff",
  "alpha-bg": "rgba(255, 255, 255, 0)",
  "alpha-dark-bg": "#f5f5f5",
  "alpha-medium-dark-bg": "#ffffffeb",
  "attached-file-bg": "rgba(0, 0, 0, 0.1)",
  "attached-file-btn-bg": "transparent",
  "attached-file-comment": "rgba(0, 0, 0, 0.1)",
  "chat-message-bg": "#e4e6eb",
  "container-bg": "#ffffff",
  "dark-bg": "white",
  "dark-bg-odd": "#f9f9f9",
  "dark-modal-footer": "#fafafa",
  "dark-smoke-bg": "white",
  "evidence-box": "#757575",
  "evidence-box-header": "#eee",
  "filters-container-bg": "#f9f9f9",
  "gradient-light-blue-bg": "#d9f6ff",
  "light-blue-bg": "",
  "light-dark-bg": "",
  "loading-data-bg": "#eff1f6 no-repeat",
  "main-sidebar-bg": "linear-gradient(45deg, #0288d1, #26c6da)",
  "medium-dark-bg": "white",
  "message-button-bg": "#eceff1",
  "nav-fixed-option-bg": "#e4e6eb",
  "perfil-modal-button-bg": "#ffffff",
  "save-changes-bg": "#5f5f5f52",
  "search-input-filter-bg": "#f9f9f9",
  "scrollbar-bg": "#eee",
  "status-bg": "rgba(0, 0, 0, 0.3)",
  "switch-bg": "#a7a7a7",
  "tab-bg": "#eee",
  "tabs-bg": "rgb(244, 244, 244)",
  "tooltip-background": "rgba(0, 0, 0, 0.8)",
  "tracking-number-bg": "#2e89ff",
  "transparent-bg": "transparent",
  "upload-profile-img-bg": "rgba(0, 0, 0, 0.7)",
  "watch-item-bg": "#d9d9d9",
  "whatsApp-bg": "#ffffff",
  // Colors
  "active-admin-sidenav-color": "#ffffff",
  "admin-modal-button-color": "#303f9f",
  "alpha-white-color": "rgba(0, 0, 0, 0.85)",
  "attached-file-btn-color": "#3949ab",
  "blockquote-color": "#dad8d8",
  "dark-disabled-button-color": "rgba(0, 0, 0, 0.3)",
  "dark-gray": "",
  "default-color": "rgba(0,0,0,0.87)",
  "default-hover-color": "#383838",
  "favorite-time-color": "#6b6f82",
  "hover-admin-sidenav-color": "#ffffff",
  "last-articles-color": "#606060",
  "light-blue-color": "",
  "light-gray": "rgba(0, 0, 0, 0.7)",
  "medium-blue-color": "",
  "medium-gray": "rgba(0, 0, 0, 0.85)",
  "message-button-color": "rgba(0, 0, 0, 0.85)",
  "perfil-modal-button-color": "#303f9f",
  "primary-text": "#050505",
  "save-changes-color": "rgba(0, 0, 0, 0.33)",
  "search-button-color": "#606060",
  "secondary-text": "#65676b",
  "sidebar-li-active": "#08b0ec",
  "third-text": "#65676b",
  "titles-color": "#757575",
  "tooltip-color": "rgba(255, 255, 255, 0.8)",
  "user-rol-color": "#616161",
  "white-color": "#ffffff",
  // Borders
  "admin-modal-button-border": "#303f9f",
  "cancel-modal-border": "3px solid",
  "dark-border": "rgb(211, 211, 211)",
  "dark-bottom-border": "#e0e0e0",
  "dark-right-border": "#e0e0e0",
  "dark-top-border": "#e0e0e0",
  "img-border": "rgba(0, 0, 0, 0.05)",
  "lawyer-modal-border-color": "rgb(0 0 0 / 10%)",
  "medium-dark-border": "#ddd",
  "perfil-modal-button-border": "#303f9f",
  "search-button-border": "#9c9c9c",
  "search-input-border": "#ddd",
  "sidenav-divider-border-color": "#d0d0d0",
  "transparent-border": "inherit",
  // Box Shadow
  "dark-box-shadow": "0 0 4px 2px rgba(0, 0, 0, 0.1)",
  "dark-box-shadow-color": "",
  "none-box-shadow": "inset 0px 0px 6px 0px #f2f2f2",
  // Divider
  "dark-divider": "#e0e0e0",
  // Hover / Active Backgrounds
  "comments-bg-hover": "#d9d9d9",
  "dark-bg-odd-hover": "#f6f6f6",
  "light-dark-bg-hover": "#eee",
  "medium-dark-bg-hover": "#eee",
  "nav-fixed-option-bg-hover": "rgba(0,0,0,0.15)",
  "nav-fixed-option-bg-extended": "#e7f3ff",
  "sidebar-li-hover": "rgba(0,0,0,0.05)",
  "tab-bg-hover": "rgb(0 0 0 / 30%)",
  // Disabled
  "dark-disabled-button-bg": "rgba(255, 255, 255, 1)",
  "dark-disabled-button-bg-after": "#ffffff",
  "dark-disabled-button-bg-before": "#f0f0f0",
  "disabled-input-bg": "#eee",
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
