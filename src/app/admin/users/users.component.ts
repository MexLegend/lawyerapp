import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { Subject } from 'rxjs/internal/Subject';
import Swal from 'sweetalert2';

import { User } from '../../models/User';
import { UpdateDataService } from '../../services/updateData.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(
    public _updateDS: UpdateDataService,
    private _usersS: UsersService
  ) { }

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  users: User[] = [];

  ngOnInit() {
    // Get Users Supcription
    this._usersS.getUsers().subscribe(resp => {
      this.users = resp.docs;
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
        searchPlaceholder: "Buscar Users"
      },
      scrollY: "calc(100vh - 431px)",
      scrollCollapse: true
    };

    this._usersS.notifica
      .subscribe(() => {
        this.load();
        this.rerender()
      }
      )
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  delete(user: User) {
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar el User ' + user.firstName + ' ' + user.lastName,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
      .then((result) => {
        if (result.value) {
          this._usersS.deleteUser(user._id).subscribe(() => {
            this.load();
            this.rerender();
          })
        }
      })
  }

  load() {
    this._usersS.getUsers().subscribe(resp => {
      this.users = resp.docs;
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

  sendUserId(id: string, view: boolean) {
    this._updateDS.sendUserId(id, view)
  }
}
