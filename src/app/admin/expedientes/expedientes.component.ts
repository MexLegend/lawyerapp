import { Component, OnInit } from '@angular/core';
import { Files } from '../../models/Files';
import { Subject } from 'rxjs';
import { FilesService } from '../../services/files.service';
declare var $: any;

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})
export class ExpedientesComponent implements OnInit {

  expedientes: Files[] = [];
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();

  constructor(private _filesS: FilesService) { }

  ngOnInit() {
    this._filesS.obtenerExpedientes().subscribe(r => {
      console.log(r)
      this.expedientes = r.docs;
      this.dtTrigger.next();
      $(".modal").modal();
    });

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar expedientes"
      },
      autoWidth: true,
      "scrollY": "calc(100vh - 431px)",
      "scrollCollapse": true,
    };
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
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
