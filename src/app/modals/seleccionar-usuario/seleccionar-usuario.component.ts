import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { Subject } from 'rxjs/internal/Subject';
import { UsuariosService } from '../../services/usuarios.service';
import { UpdateDataService } from '../../services/updateData.service';
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
  isChecked: boolean = false;
  selectedRowData: any;
  userData: any;

  constructor(private _usuariosS: UsuariosService, private _updateData: UpdateDataService) { }

  ngOnInit() {
    // Get Users Subscription
    this._usuariosS.obtenerUsuarios().subscribe(r => {
      this.usuarios = r.docs;
      this.dtTrigger.next();
    });

    // Set UserData Subscription
    // this._updateData.getUserData().subscribe(data => this.userData = data)

    // Change Datatable Options
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar clientes.."
      },
      "scrollY": "calc(100vh - 542px)",
      "scrollCollapse": true,
      initComplete: function () {
        $("#select-users-tbl_filter").detach().appendTo('.buscadorAdminUsers');
      }
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

  // Enable Select Button On Checkbox Click And Get Data
  isCheckedFunction(data: any) {
    if (this.isChecked === false) {
      this.isChecked = true;
    }
    this.selectedRowData = data;
  }

  setData() {
    this._updateData.setUserData(this.selectedRowData);
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
