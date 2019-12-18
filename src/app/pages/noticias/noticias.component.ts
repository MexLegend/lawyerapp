import { Component, OnInit } from '@angular/core';
import { ArticulosService } from '../../services/articulos.service';
import { Articulo } from '../../models/Articulo';

declare var $: any;

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {

  noticias;

  constructor(
    private _articulosS: ArticulosService
  ) { }

  ngOnInit() {

    this._articulosS.obtenerArticulos()
      .subscribe((resp: any) => {
        this.noticias = resp.docs;
      })

    $(document).ready(function () {
      // Noticia Expand on Click
      $(document).on("click", ".activator", function (e) {
        e.preventDefault();
        $(".card-reveal").css({ "transform": "translateY(0px)", "transition": "all 0.3s ease-in-out" });
        retractNoticia();
        if ($(this).closest($(".card.sticky-action")).css("min-height") == "600px") {
          retractNoticia();
        } else {
          expandNoticia(this);
        }
      });

      // Noticia Retract on Title Click
      $(document).on("click", ".card-reveal-title", function (e) {
        e.preventDefault();
        $(".card-reveal").css({ "transform": "translateY(0px)", "transition": "all 0.3s ease-in-out" });
        $(".btn-news").text("Mostrar más");
        retractNoticia();
      });

      // Noticia Retract on Button Click
      // $(document).on("click", ".btn-news", function (e) {
      //   e.preventDefault();
      //   if ($(this).text() == "Mostrar más") {
      //     $(".card-reveal").css({ "transform": "translateY(0px)", "transition": "all 0.3s ease-in-out" });
      //     $(this).addClass("activator")
      //   } else {
      //     $(this).removeClass("activator");
      //   }
      // });

      // Function Expand Noticia 
      function expandNoticia(element) {
        $(element).closest($(".card.sticky-action")).find($(".btn-news")).text("Mostrar menos");
        $(element).closest($(".card.sticky-action")).css({ "min-height": "600px", "transition": "all 0.3s ease-in-out" });
        $(element).closest($(".card.sticky-action")).find($(".card-footer.card-action")).removeClass("card-footer-inactive");
        $(element).closest($(".card.sticky-action")).find($(".card-footer.card-action")).addClass("card-footer-active");
      }

      // Function Retract Noticia 
      function retractNoticia() {
        $(".btn-news").text("Mostrar más");
        // $(".card-reveal").css({ "transform": "translateY(0px)", "transition": "all 0.3s ease-in-out" });
        $(".card.sticky-action").css({ "max-height": "600px", "min-height": "286px", "transition": "all 0.3s ease-in-out" });
        $(".card.sticky-action").find($(".card-footer.card-action")).removeClass("card-footer-active");
        $(".card.sticky-action").find($(".card-footer.card-action")).addClass("card-footer-inactive");
      }
    });

  }

}
