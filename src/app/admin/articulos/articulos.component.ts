import { Component, OnInit, OnDestroy } from '@angular/core';
import { Articulo } from '../../models/Articulo';
import { Subject } from 'rxjs';
import { ArticulosService } from '../../services/articulos.service';
declare var $: any;

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})
export class ArticulosComponent implements OnInit {

  articulos: Articulo[] = [];
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();


  constructor(
    private _articulosS: ArticulosService
  ) { }

  ngOnInit() {
    this._articulosS.obtenerArticulos().subscribe(r => {
      this.articulos = r.docs;
      this.dtTrigger.next();
      $('.modal').modal();
    });

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar articulos"
      },
      autoWidth: true,
      "scrollY": "calc(100vh - 431px)",
      "scrollCollapse": true,

    }
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
