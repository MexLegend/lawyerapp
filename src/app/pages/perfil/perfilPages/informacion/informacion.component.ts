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

      // Initialize Select
      $('select').formSelect();
    });
  }
}