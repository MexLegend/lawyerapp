import { Component, OnInit, HostListener } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { UsersService } from "../../services/users.service";
import { MatDialog } from "@angular/material/dialog";
import { BePrimeComponent } from "../../modals/be-prime/be-prime.component";
import { ThemeService } from "../../services/theme.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ChatService } from "../../services/chat.service";
import { Subscription } from "rxjs";

declare var $: any;

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.component.html",
  styleUrls: ["./perfil.component.css"],
})
export class PerfilComponent implements OnInit {
  constructor(
    public _chatS: ChatService,
    public dialog: MatDialog,
    public router: Router,
    public _themeS: ThemeService,
    public _usersS: UsersService
  ) {
    this.subscriptionsArray.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.actSt = this.router.url;
        }
      })
    );
  }

  subscriptionsArray: Subscription[] = [];

  isDarkThemeActive: boolean = false;
  actSt: any = "";

  // Screen Size Variable
  public innerScreenWidth: any;

  // Chat Sidenav Variables
  public showSidenav: boolean = true;
  public sidenavMode: any = "side";

  // Perfect Scrollbar Variable
  public config: PerfectScrollbarConfigInterface = {};

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerScreenWidth = window.innerWidth;

    if (this.innerScreenWidth > 993) {
      this.showSidenav = true;
      this.sidenavMode = "side";
    } else {
      this.showSidenav = false;
      this.sidenavMode = "push";
    }
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    // Toogle Sidenav According to Screen Size
    if (this.innerScreenWidth > 993) {
      this.showSidenav = true;
      this.sidenavMode = "side";
    } else {
      this.showSidenav = false;
      this.sidenavMode = "push";
    }

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

  // Change Theme Function
  changeTheme() {
    this._themeS.seCurrentTheme("update");
  }

  openPrimeModal() {
    let dialogRef = this.dialog.open(BePrimeComponent, { autoFocus: false, disableClose: true });

    this.subscriptionsArray.push(
      dialogRef.afterOpened().subscribe(() => {
        $("body").css("overflow", "hidden");
      })
    );

    this.subscriptionsArray.push(
      dialogRef.afterClosed().subscribe(() => {
        $("body").css("overflow", "");
      })
    );
  }

  // Open Chat Sidenav
  toogleChatSidenav() {
    this._chatS.toggleChat();
  }
}
