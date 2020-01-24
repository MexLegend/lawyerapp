import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Subject, Subscription } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { WebPushNotificationService } from '../services/webPushNotification.service';
import { NotificationsPagination } from '../models/Notification';

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

  constructor(
    public _usuariosS: UsuariosService,
    public _wPNS: WebPushNotificationService
  ) { }
  
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

          if(notification) {
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
        // if($(this).closest("a").hasClass("active")){

        // }
      });

      // Change Z-index of Navbar When Sidenav Show / Hide

      // Change Z-index of sidenav on clic
      $(document).on("click", "#sidenav-trigger-btn", function () {
        $(".scroll-sidenav").css("z-index", "998");
      });

      // Select the node that will be observed for mutations
      const targetNode = document.getElementById('contact-sidenav');

      // Options for the observer (which mutations to observe)
      const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['style', 'class'] };

      // Callback function to execute when mutations are observed
      const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
          }
          else if (mutation.type === 'attributes') {
            if (($(mutation.target)[0].style.cssText == "transform: translateX(-105%);")) {
              $(".scroll-sidenav").css("z-index", "0");
            }
          }
        }
      };

      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(targetNode, config);

      // Later, you can stop observing
      // observer.disconnect();
    });
  }
}
