import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilesService } from '../../../../services/files.service';
import { Files } from '../../../../models/Files';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})
export class ExpedientesComponent implements OnInit {

  files: Files[];

  constructor(
    private router: Router,
    public _filesS: FilesService
  ) { }

  ngOnInit() {
    this._filesS.obtenerExpedientes()
        .subscribe((resp) => {
          console.log(resp)
          this.files = resp.docs;
        })
  }

  goToExpediente(route: any) {
    const url = `/perfil/expediente-detalle/${ route }`;
    this.router.navigateByUrl(url)
    console.log(url)
  }

}
