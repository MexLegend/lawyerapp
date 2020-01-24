import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})
export class ExpedientesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  generarClave() {
    // Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
    const allNumbers = [..."0123456789"];

    const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];

    const generator = (base, len) => {
      return [...Array(len)]
        .map(i => base[Math.random() * base.length | 0])
        .join('');
    };

    document.getElementsByClassName("clave-generada")[0].innerHTML = generator(base, 12);

  }

}
