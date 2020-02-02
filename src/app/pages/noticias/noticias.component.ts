import { Component, OnInit } from '@angular/core';
import { ArticulosService } from '../../services/articulos.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {

  allowedChars = '@ # $ % ^ & * ( ) _ - ., ? < > { } [ ] ! +';
  text = '<b><i>Ejemplo-2</i></b>';
  noticias;
  paginaActual: number = 1;

  constructor(
    private _articulosS: ArticulosService,
    private router: Router
  ) { }

  ngOnInit() {

    this._articulosS.obtenerArticulos()
      .subscribe((resp: any) => {
        this.noticias = resp.docs;
      })
  }

  // Go to News Comments Section
  goToComments(id): void {
    this.router.navigate([`/noticia-detalle/${id}`]);
    $(document).ready(function () {
      // scroll to your element
      document.getElementById("comments-box").scrollIntoView(true);

      // now account for fixed header
      var scrolledY = window.scrollY;

      if (scrolledY) {
        window.scroll(0, scrolledY - 145);
      }
    });
  }

}
