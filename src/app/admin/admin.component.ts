import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { Subject, Subscription } from 'rxjs';

import { NotificationsPagination } from '../models/Notification';
import { UsersService } from '../services/users.service';
import { WebPushNotificationsService } from '../services/webPushNotifications.service';

declare var $: any;


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  // Get NgScrollbar reference
  @ViewChild(NgScrollbar, null) scrollBar: NgScrollbar;
  actSt: any = '';
  isfullscreen: boolean = false;
  notifications: NotificationsPagination;
  notificationsSubs: Subscription;
  // Stream that will update title font size on scroll down
  size$ = new Subject();
  public type: string = 'component';
  // Unsubscriber for elementScrolled stream.
  unsubscriber$ = Subscription.EMPTY;

  constructor(
    public router: Router,
    public _usersS: UsersService,
    public _wPNS: WebPushNotificationsService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actSt = this.router.url;
      }
    })
  }

  ngOnInit() {
    this._wPNS.get()
      .subscribe(resp => {
        this.notifications = resp;
      })

    this.notificationsSubs = this._wPNS.getNotifications()
      .subscribe(notification => {

        if (notification) {
          this._wPNS.get()
            .subscribe(resp => {
              this.notifications = resp;
            })
        }
      });

    $(document).ready(function () {
      // Initialize Main Admin Sidenav
      $('#admin-sidenav').sidenav();

      // Initialize Dropdown
      $(".dropdown-trigger").dropdown({
        coverTrigger: false,
        constrain_width: true,
        gutter: 0,
        belowOrigin: false,
        alignment: "right"
      });

      $('.dropdown-content').on('click', function (e) {
        console.log("Hola");

        e.stopPropagation();
      });

      // Create New User Modal Init
      $("#modalUsers").modal({
        onCloseEnd: () => {
          $("#formUsers")[0].reset();
        },
        onOpenStart: () => {
          if ($(".upload-img")) {
            $(".upload-img").css('background-image', '');
          }
        }
      });

      // Create New Article Modal Init
      $("#modal-Articulo").modal({
        onCloseEnd: () => {
          $("#formArticulos")[0].reset();
        },
        onOpenStart: () => {
          if ($(".upload-img")) {
            $(".upload-img").css('background-image', '');
          }
        }
      });

      // Create New File Modal Init
      $("#modal-Expediente").modal({
        onCloseEnd: () => {
          // $("#formExpedientes")[0].reset();
        },
      });

      $("#selectUser").modal();
    });
  }

  ngOnDestroy() {
    this.notificationsSubs.unsubscribe();
  }

  // Change Theme Function
  changeTheme(event) {
    console.log(event.checked);
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
}