import {
  Component,
  OnDestroy,
  OnInit,
  HostListener,
  ViewChild,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subject, Subscription } from "rxjs";
import { MatSidenav, MatMenuTrigger } from "@angular/material";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { NotificationsPagination } from "../models/Notification";
import { UsersService } from "../services/users.service";
import { ThemeService } from "../services/theme.service";
import { ChatService } from "../services/chat.service";
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit, OnDestroy {
  constructor(
    public _chatS: ChatService,
    public router: Router,
    public _themeS: ThemeService,
    public _usersS: UsersService,
    public _utilitiesS: UtilitiesService
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

  // Chat
  @ViewChild("adminChatSidenav", { static: false })
  public sidenavChat: MatSidenav;
  @ViewChild("beforeMenu", { static: false }) adminMenu: MatMenuTrigger;

  actSt: string;
  notifications: NotificationsPagination;
  // Stream that will update title font size on scroll down
  size$ = new Subject();
  public type: string = "component";

  showFiller = false;
  // Theme Variable
  public isDarkThemeActive: boolean = false;
  // Screen Size Variables
  public innerScreenHeight: any;
  public innerScreenWidth: any;
  // Chat Sidenav Variables
  public showSidenav: boolean = true;
  public sidenavMode: any = "side";

  // Perfect Scrollbar Variable
  public config: PerfectScrollbarConfigInterface = {};

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.innerScreenWidth = window.innerWidth;
    this.innerScreenHeight = window.innerHeight;

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
    this.innerScreenHeight = window.innerHeight;
    this.innerScreenWidth = window.innerWidth;

    // Toogle Sidenav According to Screen Size
    if (this.innerScreenWidth > 993) {
      this.showSidenav = true;
      this.sidenavMode = "side";
    } else {
      this.showSidenav = false;
      this.sidenavMode = "push";
    }

    // Get Current Theme From Local Storage
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

  ngAfterViewInit(): void {
    this._chatS.setChatSidenav(this.sidenavChat);
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Change Theme Function
  changeTheme() {
    this._themeS.seCurrentTheme("update");
  }

  closeMenu() {
    this.adminMenu.closeMenu();
  }
}
