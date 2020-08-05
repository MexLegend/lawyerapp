import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material';

import { UsersService } from '../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { BePrimeComponent } from '../../modals/be-prime/be-prime.component';
import { ThemeService } from '../../services/theme.service';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ChatService } from '../../services/chat.service';

declare var $: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor(
    public _chatS: ChatService,
    public dialog: MatDialog,
    public router: Router,
    public _themeS: ThemeService,
    public _usersS: UsersService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actSt = this.router.url;
      }
    })

    this._themeS.checkStorage();

    this._themeS.checkChanges();
  }

  isfullscreen: boolean = false;
  actSt: any = '';

  // Screen Size Variable
  public innerScreenWidth: any;

  // Chat Sidenav Variables
  public showSidenav: boolean = true;
  public sidenavMode: any = "side";

  // Perfect Scrollbar Variable
  public config: PerfectScrollbarConfigInterface = {};

  // Detect Real Screen Size
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerScreenWidth = window.innerWidth;

    if (this.innerScreenWidth > 993) {
      this.showSidenav = true;
      this.sidenavMode = "side";
    }
    else {
      this.showSidenav = false;
      this.sidenavMode = "push";
    }
  }

  // Chat
  @ViewChild('perfilChatSidenav', null) public sidenavChat: MatSidenav;

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

    $("#modal-File-Upload").modal();
  }

  ngAfterViewInit(): void {
    this._chatS.setChatSidenav(this.sidenavChat);
  }

  // Change Theme Function
  changeTheme() {
    this._themeS.darkTheme.setValue(this._themeS.val);
    this._themeS.checkStorage();
  }

  // Close Full Screen Function
  closefullscreen() {
    const docWithBrowsersExitFunctions = document as Document & {
      mozCancelFullScreen(): Promise<void>;
      webkitExitFullscreen(): Promise<void>;
      msExitFullscreen(): Promise<void>;
    };
    if (docWithBrowsersExitFunctions.exitFullscreen) {
      docWithBrowsersExitFunctions.exitFullscreen();
    } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
      docWithBrowsersExitFunctions.mozCancelFullScreen();
    } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      docWithBrowsersExitFunctions.webkitExitFullscreen();
    } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
      docWithBrowsersExitFunctions.msExitFullscreen();
    }
    this.isfullscreen = false;
  }

  openPrimeModal() {
    let dialogRef = this.dialog.open(BePrimeComponent, { autoFocus: false });

    dialogRef.afterOpened().subscribe(result => {
      $('body').css('overflow', 'hidden');
    });

    dialogRef.afterClosed().subscribe(result => {
      $('body').css('overflow', '');
    });
  }

  // Toggle Full Screen Function
  openfullscreen() {
    // Trigger fullscreen
    const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };

    if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
      docElmWithBrowsersFullScreenFunctions.requestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
      docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
    } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
      docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
    }
    this.isfullscreen = true;
  }

  switch() {
    this._themeS.switchVal()
  }
}
