import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';

import { UsersService } from '../services/users.service';
import { WhatsappService } from '../services/whatsapp.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  constructor(
    public _chatS: ChatService,
    public router: Router,
    public _usersS: UsersService,
    public _whatsappS: WhatsappService
  ) { }

  form: FormGroup;

  // Chat
  @ViewChild('mainChatSidenav', null) public sidenavChat: MatSidenav;

  ngOnInit() {
    this.initWhatsappForm();

    $(document).ready(function () {
      // Open WhatsApp Window on Click
      $(document).on("click", "#btn-whatsapp", function () {
        $(".whatsAppCard").css({ "visibility": "visible", "opacity": "1" });
      });

      // Close WhatsApp Window on Click
      $(document).on("click", ".btn-whatsApp-close", function () {
        $(".whatsAppCard").css({ "transition": "visibility 0.5s, opacity 0.5s ease-in-out", "visibility": "hidden", "opacity": "0" });
      });
    });
  }

  ngAfterViewInit(): void {
    this._chatS.setChatSidenav(this.sidenavChat);
  }

  sendM() {
    this._whatsappS.sendMessage(this.form.value.message).subscribe(resp => {
      console.log(resp);
      this.form.reset();
    })
  }

  private initWhatsappForm() {
    this.form = new FormGroup({
      message: new FormControl(null, Validators.required)
    });
  }
}