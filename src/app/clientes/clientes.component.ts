import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSidenav } from "@angular/material";
import { Router } from "@angular/router";

import { UsersService } from "../services/users.service";
import { WhatsappService } from "../services/whatsapp.service";
import { ChatService } from "../services/chat.service";
import { ThemeService } from "../services/theme.service";
import { UtilitiesService } from '../services/utilities.service';

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
    public _utilitiesS: UtilitiesService,
    public _whatsappS: WhatsappService
  ) {}

  form: FormGroup;
  innerScreenHight: number = 0;
  isDarkThemeActive: boolean = false;

  // Chat
  @ViewChild("mainChatSidenav", { static: false })
  public sidenavChat: MatSidenav;
  @ViewChild("mainSidenav", { static: false }) public mainSidenav: MatSidenav;

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.innerScreenHight = window.innerHeight;
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenHight = window.innerHeight;
    this.initWhatsappForm();

    // Get Initial Theme From Local Storage
    this._themeS.seCurrentTheme("get").then((isDarkThemeActive) => {
      this.isDarkThemeActive = isDarkThemeActive;
    });

    // Get New Theme After Been Updated
    this._themeS.getSwitchValue().subscribe((isDarkThemeActive) => {
      this.isDarkThemeActive = isDarkThemeActive;
    });
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
