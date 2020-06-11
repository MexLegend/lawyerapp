import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { UsersService } from '../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { BePrimeComponent } from '../../modals/be-prime/be-prime.component';

declare var $: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor(
    public router: Router,
    public _usersS: UsersService,
    public dialog: MatDialog
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actSt = this.router.url;
      }
    })
  }

  isfullscreen: boolean = false;
  actSt: any = '';
  // dialogRef: any = null;

  ngOnInit() {
    // Initialize Sidenav
    $('#perfil-sidebar').sidenav();

    $("#modal-File-Upload").modal();
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
}
