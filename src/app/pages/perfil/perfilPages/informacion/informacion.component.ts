import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {

  constructor() { }

  languages = new FormControl();

  languageList: string[] = ['Español', 'Inglés', 'Francés', 'Alemán', 'Japonés', 'Portugués'];

  ngOnInit() {
    $(document).ready(function () {

      // Initialize DatePicker
      $('.birthdate-picker').datepicker({
        firstDay: true,
        format: 'dd mmmm, yyyy',
        i18n: {
          months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
          monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
          weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
          weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
          weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"],
          cancel: 'Cancelar',
          clear: 'Limpar',
          done: 'Ok'
        },
        twelveHour: false, // twelve hours, use AM/PM
        autoclose: false  //Close the timepicker automatically after select time
      });

      // Initialize Select
      $('select').formSelect();
    });
  }



}
