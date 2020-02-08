import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { Subject } from 'rxjs/internal/Subject';
import { UsuariosService } from '../../services/usuarios.service';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-seleccionar-usuario',
  templateUrl: './seleccionar-usuario.component.html',
  styleUrls: ['./seleccionar-usuario.component.css']
})
export class SeleccionarUsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();

  constructor(private _usuariosS: UsuariosService, private http: HttpClient) { }

  ngOnInit() {
    this._usuariosS.obtenerUsuarios().subscribe(r => {
      this.usuarios = r.docs;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 4,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar clientes.."
      },
      initComplete: function () {
        $("#select-users-tbl_filter").detach().appendTo('.buscadorAdminUsers');
      },
      scrollCollapse: true,
      fixedColumns: true
    };

    $(document).ready(function () {
      // Show/Hide Close Serach Box Button
      $(document).on("keyup", ".buscadorAdminUsers input", function () {
        if ($(this).val() !== '') {
          $(this).closest($(".buscadorAdminUsers")).find($('.filter-close')).css('display', "flex");
        } else {
          $(this).closest($(".buscadorAdminUsers")).find($('.filter-close')).css('display', "none");
        }
      })
      // Clear Serach Box On Close Button Click
      $(document).on("click", ".filter-close", function () {
        $(this).css('display', "none");
        $(this).closest($(".buscadorAdminUsers")).find($('.buscadorAdminUsers input')).val("");
        $("#select-users-tbl").DataTable().search("").draw();
      })
    });
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
