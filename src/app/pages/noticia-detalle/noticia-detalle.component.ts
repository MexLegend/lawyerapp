import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticulosService } from '../../services/articulos.service';
import { Articulo } from 'src/app/models/Articulo';
declare var $: any;

@Component({
  selector: 'app-noticia-detalle',
  templateUrl: './noticia-detalle.component.html',
  styleUrls: ['./noticia-detalle.component.css']
})
export class NoticiaDetalleComponent implements OnInit {

  login = 'login';
  noticia: Articulo;

  constructor(
    private location: Location,
    public _usuariosS: UsuariosService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public _noticiasS: ArticulosService
  ) {
    this.activatedRoute.params.subscribe( params => {
      const id = params['id'];

      if ( id !== 'new' ) {
        this.cargarNoticia( id )
      }
    })
  }

  ngOnInit() {
    $(document).ready(function () {
      // Hide Comment Buttons When Cancel Button is Clicked
      $(document).on("click", ".cancel-comment", function () {
        $("#comment").val('');
        $(".comment-label").removeClass("active");
        $('.send-comment').prop('disabled', true);
        $(".comment-buttons").removeClass("comment-buttons-show");
        $(".comment-buttons").addClass("comment-buttons-hide");
      });
      // Enable Comment Button When Text Input is Not Empty
      $(document).on("keyup", "#comment", function () {
        if ($(this).val() !== '') {
          $('.send-comment').prop('disabled', false);
        } else {
          $('.send-comment').prop('disabled', true);
        }
      })
    });
  }

  // Show Comment Buttons When Comment Input Text is Focused
  showCommentButtons() {
    if ($(".comment-buttons").hasClass("comment-buttons-hide")) {
      $(".comment-buttons").removeClass("comment-buttons-hide");
    }
    $(".comment-buttons").addClass("comment-buttons-show");
  }

  // Return to Previous Page
  goBack(): void {
    this.location.back();
  }

  // Trigger Login Modal When Is Not Logged In
  showM() {
    $('#modalRegistro').modal('open');
  }

  cargarNoticia(id) {
    this._noticiasS.obtenerArticulo( id )
        .subscribe( noticia => {
          this.noticia = noticia;
        })
  }

}
