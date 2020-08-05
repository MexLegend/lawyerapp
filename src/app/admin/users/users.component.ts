import { Component, OnInit, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

import { User } from '../../models/User';
import { UpdateDataService } from '../../services/updateData.service';
import { UsersService } from '../../services/users.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NotificationsService } from '../../services/notifications.service';
import { UsersFormComponent } from '../../modals/users-form/users-form.component';

interface Role {
  value: string;
  viewValue: string;
  icon: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public _notificationsS: NotificationsService,
    public _updateDS: UpdateDataService,
    private _usersS: UsersService
  ) { }

  currentPage: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  filterValue: string;
  role: Role[] = [
    { value: "ADMIN", viewValue: "Administrador", icon: "fas fa-users-cog" },
    { value: "PARTNER", viewValue: "Asociado", icon: "fas fa-user-tie" },
    { value: "CLIENT", viewValue: "Cliente", icon: "fas fa-user-tag" },
    { value: "USER", viewValue: "Nuevo", icon: "fas fa-user-plus" }
  ];
  selectedEntry: number = 5;
  users: User[] = [];

  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

  // Detect Real Screen Size
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerScreenWidth = window.innerWidth;
    if (this.innerScreenWidth > 520) {
      this.mobileFilterActivated = false;
    }
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    // Get Users Supcription
    this._usersS.getUsers().subscribe(resp => {
      this.users = resp.docs;
    });

    this._usersS.notifica
      .subscribe(() => {
        this.load();
      }
      )
  }

  // Change Current Pagination Page
  changeEntry($event) {
    this.selectedEntry = $event;
    this.currentPage = 1;
  }

  changeRol(id, rol) {
    console.log(rol)
    this._usersS.updateRol(id, rol).subscribe(resp => {
      console.log(resp)
      if (resp.ok) {
        this._notificationsS.message(
          "success",
          `Rol Actualizado`,
          `Usuario: ${resp.user.firstName} ${resp.user.lastName} `,
          false,
          true,
          "Aceptar",
          ""
        );
      }
    })
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
          })
        }
      })
  }

  filter(value: string) {
    if (value.length >= 1 && value !== '')
      this.filterValue = value;
    else
      this.filterValue = '';
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  load() {
    this._usersS.getUsers().subscribe(resp => {
      this.users = resp.docs;
    })
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  // Open Users Modal
  openUsersModal(idUser?: any) {
    let dialogRef = idUser && idUser !== '' ? this.dialog.open(UsersFormComponent, { data: { idUser, action: 'Editar' }, autoFocus: false }) : this.dialog.open(UsersFormComponent, { data: { action: 'Crear' }, autoFocus: false });

    // dialogRef.afterClosed().subscribe(result => {
    //   localStorage.removeItem('userData');
    //   localStorage.removeItem('fileData');
    //   this._updateDS.setUserData(null);
    // });
  }

  sendUserId(id: string, view: boolean) {
    this._updateDS.sendUserId(id, view)
  }
}
