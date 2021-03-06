import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSidenav } from "@angular/material";
import { Router } from "@angular/router";

import { UsersService } from "../services/users.service";
import { WhatsappService } from "../services/whatsapp.service";
import { ChatService } from "../services/chat.service";
import { ThemeService } from "../services/theme.service";

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.css"],
})
export class ClientesComponent implements OnInit {
  constructor(
    public _chatS: ChatService,
    public router: Router,
    public _themeS: ThemeService,
    public _usersS: UsersService,
    public _whatsappS: WhatsappService
  ) {}

  form: FormGroup;
  isDarkThemeActive: boolean = false;

  // Chat
  @ViewChild("mainChatSidenav", null) public sidenavChat: MatSidenav;
  @ViewChild("mainSidenav", null) public mainSidenav: MatSidenav;

  ngOnInit() {
    this.initWhatsappForm();

    // Get Initial Theme From Local Storage
    this._themeS.seCurrentTheme("get").then((isDarkThemeActive) => {
      this.isDarkThemeActive = isDarkThemeActive;
    });

    // Get New Theme After Been Updated
    this._themeS.getSwitchValue().subscribe((isDarkThemeActive) => {
      this.isDarkThemeActive = isDarkThemeActive;
    });

    // Live Chat Widget
    var Tawk_API = Tawk_API || {},
      Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/6015b931c31c9117cb742f31/1etadmqih";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();

    /*
    $(document).ready(function () {
      // Open WhatsApp Window on Click
      $(document).on("click", "#btn-whatsapp", function () {
        $(".whatsAppCard").css({ visibility: "visible", opacity: "1" });
      });

      // Close WhatsApp Window on Click
      $(document).on("click", ".btn-whatsApp-close", function () {
        $(".whatsAppCard").css({
          transition: "visibility 0.5s, opacity 0.5s ease-in-out",
          visibility: "hidden",
          opacity: "0",
        });
      });
    });
    */
  }

  ngAfterViewInit(): void {
    this._chatS.setChatSidenav(this.sidenavChat);
    this._chatS.setMainSidenav(this.mainSidenav);
  }

  initWhatsappForm() {
    this.form = new FormGroup({
      message: new FormControl(null, Validators.required),
    });
  }

  sendM() {
    this._whatsappS.sendMessage(this.form.value.message).subscribe((resp) => {
      console.log(resp);
      this.form.reset();
    });
  }

  // Scroll to Top Function
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  // Open Main Sidenav
  toogleMainSidenav() {
    this._chatS.toggleMainSidenav();
  }
}
