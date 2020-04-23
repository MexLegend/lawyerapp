import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { Files } from '../../models/Files';
import { FilesService } from '../../services/files.service';
import { UpdateDataService } from '../../services/updateData.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  constructor(
    public _filesS: FilesService,
    public _updateDS: UpdateDataService
  ) { }
  
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  files: Files[] = [];

  ngOnInit() {
    this._filesS.getFiles().subscribe(resp => {
      this.files = resp.docs;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      responsive: true,
      lengthChange: false,
      "destroy": true,
      language: {
        search: "",
        "infoFiltered": "",
        searchPlaceholder: "Buscar expedientes"
      },
      scrollY: "calc(100vh - 431px)",
      scrollCollapse: true
    };

    this._filesS.notifica
        .subscribe(r => {
          this.load();
          this.rerender()
        }
    )
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  delete(file: Files) {
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar el expediente ' + file.affair,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
      .then((result) => {
        if (result.value) {
          this._filesS.deleteFile(file._id).subscribe(() => {
            this.load();
            this.rerender();
          })
        }
      })
  }

  generateKey() {
    // Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
    const allNumbers = [..."0123456789"];

    const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];

    const generator = (base, len) => {
      return [...Array(len)]
        .map(i => base[Math.random() * base.length | 0])
        .join('');
    };

    document.getElementsByClassName("clave-generada")[0].innerHTML = generator(base, 12);

  }

  load() {
    this._filesS.getFiles().subscribe(resp => {
      this.files = resp.docs;
    })
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

  sendId(id: string, action: string) {
    this._updateDS.sendFileId(id, action)
  }
}