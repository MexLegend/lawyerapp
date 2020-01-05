import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WhatsappService } from '../services/whatsapp.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  form: FormGroup;

  constructor(
    public router: Router,
    public _usuariosS: UsuariosService,
    public _whatsappS: WhatsappService
  ) { }

  ngOnInit() {
    this.initWhatsappForm();

    $(document).ready(function () {
      // Open WhatsApp Window on Click
      $(document).on("click", "#btn-whatsapp", function () {
        $(".whatsAppCard").css({"visibility": "visible", "opacity" : "1"});
      });

      // Close WhatsApp Window on Click
      $(document).on("click", ".btn-whatsApp-close", function () {
        $(".whatsAppCard").css({"transition": "visibility 0.5s, opacity 0.5s ease-in-out", "visibility": "hidden", "opacity" : "0"});
      });
    });

  }

  private initWhatsappForm() {
    this.form = new FormGroup({
      message: new FormControl(null, Validators.required)
    });
  }

  enviar() {

    this._whatsappS.enviarMensaje(this.form.value.message).subscribe(resp => {
      console.log(resp);
      this.form.reset();
    })
  }
}
