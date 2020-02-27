import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { Subject } from 'rxjs/internal/Subject';
import { UsuariosService } from '../../services/usuarios.service';
import Swal from 'sweetalert2';
import { UpdateDataService } from '../../services/updateData.service';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(
    private _usuariosS: UsuariosService,
    public _upS: UpdateDataService
  ) { }

  usuarios: Usuario[] = [];

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  ngOnInit() {
    // Get Users Supcription
    this._usuariosS.obtenerUsuarios().subscribe(r => {
      this.usuarios = r.docs;
      this.dtTrigger.next();
    });

    // Datatable Options
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar usuarios"
      },
      scrollY: "calc(100vh - 431px)",
      scrollCollapse: true
    };

    this._usuariosS.notifica
      .subscribe(r => {
        this.cargarUsuarios();
        this.rerender()
      }
      )
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  cargarUsuarios() {
    this._usuariosS.obtenerUsuarios().subscribe(r => {
      this.usuarios = r.docs;
    })
  }

  borrarUsuario(usuario: Usuario) {
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar el usuario ' + usuario.firstName + ' ' + usuario.lastName,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
      .then((result) => {
        if (result.value) {
          this._usuariosS.eliminarUsuario(usuario._id).subscribe(borrado => {
            this.cargarUsuarios();
            this.rerender();
          })
        }
      })
  }

  sendUserId(id: string) {
    this._upS.sendUserId(id)
  }

  // Update Datatable data after content changes
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
