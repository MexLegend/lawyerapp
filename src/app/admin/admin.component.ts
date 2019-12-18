import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Subject, Subscription } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';

declare var $: any, M: any;


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public type: string = 'component';

  // Stream that will update title font size on scroll down
  size$ = new Subject();

  // Unsubscriber for elementScrolled stream.
  unsubscriber$ = Subscription.EMPTY;

  // Get NgScrollbar reference
  @ViewChild(NgScrollbar, null) scrollBar: NgScrollbar;

  constructor(
    public _usuariosS: UsuariosService
  ) { }

  ngOnInit() {

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


      // Change Z-index of Navbar When Sidenav Show / Hide

      // Change Z-index of sidenav on clic
      $(document).on("click", "#sidenav-trigger-btn", function () {
        $(".scroll-sidenav").css("z-index", "996");
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
            console.log('A child node has been added or removed.');
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
