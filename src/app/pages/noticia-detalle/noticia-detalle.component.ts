import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service';
declare var $: any;

@Component({
  selector: 'app-noticia-detalle',
  templateUrl: './noticia-detalle.component.html',
  styleUrls: ['./noticia-detalle.component.css']
})
export class NoticiaDetalleComponent implements OnInit {

  login = 'login';

  constructor(
    private location: Location,
    public _usuariosS: UsuariosService
  ) { }

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

}
