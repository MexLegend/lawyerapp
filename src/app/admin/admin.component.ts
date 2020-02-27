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

      // Create New User Modal Init
      $("#modalUsuarios").modal({
        onCloseEnd: () => {
          $("#formUsuarios")[0].reset();
        },
        onOpenStart: () => {
          $('.client-action').text('Crear');
          $('#userPassInput').show();
        }
      });

      // Create New Article Modal Init
      $("#modal-Articulo").modal({
        onCloseEnd: () => {
          $("#formArticulos")[0].reset();
        },
        onOpenStart: () => {
          $('.article-action').text('Crear');
        }
      });

      // Create New File Modal Init
      $("#modal-Expediente").modal({
        onCloseEnd: () => {
          $("#formExpedientes")[0].reset();
        },
        onOpenStart: () => {
          $('.file-action').text('Crear');
        }
      });

      $("#selectUser").modal();

      // Close every sidenav intance before open a new one
      $(document).on("click", "#main-sidenav-trigger", function () {
        $('#contact-sidenav').sidenav('close');
      });

      // Open Main SideNav on Click
      $(document).on("click", "#main-sidenav-trigger", function () {
        $("#slide-out").addClass("sidenav-active");
        $(".sidenav-overlay").addClass("sidenav-overlay-active");
        $(".sidenav-overlay").removeClass("sidenav-overlay-inactive");
      });

      // Close Main SideNav on Click
      $(document).on("click", ".sidenav-overlay", function () {
        $(".sidenav-overlay").removeClass("sidenav-overlay-active");
        $("#slide-out").removeClass("sidenav-active");
        $("body").css("overflow", "");
      });
      // Close Main SideNav If Screen Size < 992px
      $(window).bind('DOMContentLoaded load resize', function () {
        if ($(window).innerWidth() > 992) {
          $("#slide-out").removeClass("sidenav-active");
          $(".sidenav-overlay").addClass("sidenav-overlay-inactive");
          $(".sidenav-overlay").css({ "display": "none", "opacity": 0 });
          $("body").css("overflow", "");
        }
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