import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { Subject } from 'rxjs/internal/Subject';
import { UsuariosService } from '../../services/usuarios.service';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();

  constructor(private _usuariosS: UsuariosService, private http: HttpClient) { }

  ngOnInit() {
    this._usuariosS.obtenerUsuarios().subscribe(r => {
      this.usuarios = r.docs;
      this.dtTrigger.next();
      $('.modal').modal();
    });

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 5,
      responsive: true,
      lengthChange: false,
      language: {
        search: "",
        searchPlaceholder: "Buscar usuarios"
      },
      scrollY: "220px",
      scrollX: true,
      scrollCollapse: true,
      fixedColumns: true
    };
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
