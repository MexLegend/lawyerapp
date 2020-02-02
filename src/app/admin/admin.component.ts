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
}
