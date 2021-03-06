import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";

import { UsersService } from "../../services/users.service";
import { ThemeService } from "../../services/theme.service";
import { ChatService } from "../../services/chat.service";
import { ModalAlertService } from "../../services/modal-alert.service";
import { Subscription } from "rxjs";
import { UtilitiesService } from "../../services/utilities.service";

declare var $: any;

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  constructor(
    public _alertModalS: ModalAlertService,
    public _chatS: ChatService,
    public router: Router,
    public _themeS: ThemeService,
    public _usersS: UsersService,
    public _utilitiesS: UtilitiesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  tFo: string = "";
  isDarkThemeActive: boolean = false;
  postReactionAlertModalRef: any = null;

  // Close Post reaction Alert Modal When Clics On <a> Element
  @HostListener("document:click", ["$event"])
  onGlobalClick(event: any): void {
    if (
      (event.target.nodeName === "A" || event.target.nodeName === "SPAN") &&
      this.postReactionAlertModalRef
    ) {
      this.postReactionAlertModalRef.close();
      event.preventDefault();
    }
  }

  ngOnInit() {
    // Get Alert Modal Subscription
    this.subscriptionsArray.push(
      this._alertModalS.getModalAlertRef().subscribe((modalRef) => {
        this.postReactionAlertModalRef = modalRef;
      })
    );

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

    $(document).ready(function () {
      // Sinenav Inicialization
      $("#main-client-sidebar").sidenav();

      // Dropdown Inicialization
      $(".dropdown-trigger").dropdown({
        coverTrigger: false,
        constrain_width: true,
        gutter: 0,
        belowOrigin: false,
      });
    });
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Change Theme Function
  changeTheme() {
    this._themeS.seCurrentTheme("update");
  }

  form(tF: string) {
    this.tFo = tF;
  }

  // Scroll to Top Function
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  // Open Main Sidenav
  toogleMainSidenav() {
    this._chatS.toggleMainSidenav();
  }

  // Open Chat Sidenav
  toogleChatSidenav() {
    this._chatS.toggleChat();
  }
}
