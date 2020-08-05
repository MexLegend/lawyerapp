import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { UsersService } from '../../services/users.service';
import { ThemeService } from '../../services/theme.service';
import { ChatService } from '../../services/chat.service';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  tFo: string = '';

  constructor(
    public _chatS: ChatService,
    public router: Router,
    public _themeS: ThemeService,
    public _usersS: UsersService
  ) {
    this._themeS.checkStorage();

    this._themeS.checkChanges();
  }

  ngOnInit() {
    $(document).ready(function () {
      // Sinenav Inicialization
      $('#main-client-sidebar').sidenav();

      // Dropdown Inicialization
      $(".dropdown-trigger").dropdown({
        coverTrigger: false,
        constrain_width: true,
        gutter: 0,
        belowOrigin: false
      });
      // Modal Incialization
      $('.modal').modal();
    })
  }

  // Change Theme Function
  changeTheme() {
    this._themeS.darkTheme.setValue(this._themeS.val);
    this._themeS.checkStorage();
  }

  form(tF: string) {
    this.tFo = tF;
  }

  // Scroll to Top Function
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  switch() {
    this._themeS.switchVal()
  }

  toogleChatSidenav() {
    this._chatS.toggleChat();
  }
}