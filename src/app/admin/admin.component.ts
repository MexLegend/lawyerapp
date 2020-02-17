import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Subject, Subscription } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { WebPushNotificationService } from '../services/webPushNotification.service';
import { NotificationsPagination } from '../models/Notification';
import { Router, NavigationEnd } from '@angular/router';

declare var $: any;


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  public type: string = 'component';
  notifications: NotificationsPagination;

  // Stream that will update title font size on scroll down
  size$ = new Subject();

  // Unsubscriber for elementScrolled stream.
  unsubscriber$ = Subscription.EMPTY;

  // Get NgScrollbar reference
  @ViewChild(NgScrollbar, null) scrollBar: NgScrollbar;

  notificationsSubs: Subscription;
  actSt: any = '';
  isfullscreen: boolean = false;

  constructor(
    public _usuariosS: UsuariosService,
    public _wPNS: WebPushNotificationService,
    public router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actSt = this.router.url;
      }
    })
  }

  ngOnDestroy() {
    this.notificationsSubs.unsubscribe();
  }

  ngOnInit() {
    this._wPNS.get()
      .subscribe(resp => {
        this.notifications = resp;
      })

    this.notificationsSubs = this._wPNS.getNotifications()
      .subscribe(notification => {
        // console.log(notification)

        if (notification) {
          this._wPNS.get()
            .subscribe(resp => {
              this.notifications = resp;
            })
        }
      });

    $(document).ready(function () {
      // Initialize Sidenav
      $('.sidenav').sidenav();

      // Initialize Dropdown
      $(".dropdown-trigger").dropdown({
        coverTrigger: false,
        constrain_width: true,
        gutter: 0,
        belowOrigin: false,
        alignment: "right"
      });

      // Close every sidenav intance before open a new one
      $(document).on("click", "#main-sidenav-trigger", function () {
        $('#contact-sidenav').sidenav('close');
      });

      // Change Main SideNav Option Style on Click
      $(document).on("click", "#slide-out li", function () {
        $("#slide-out li a").removeClass("active");
        $(this).find("a").addClass("active");
      });
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