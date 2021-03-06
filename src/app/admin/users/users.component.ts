import { Component, OnInit, HostListener } from "@angular/core";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";

import { User } from "../../models/User";
import { UpdateDataService } from "../../services/updateData.service";
import { UsersService } from "../../services/users.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { NotificationsService } from "../../services/notifications.service";
import { UsersFormComponent } from "../../modals/users-form/users-form.component";
import { Subscription } from "rxjs";
import { WebPushNotificationsService } from "../../services/webPushNotifications.service";

interface Role {
  value: string;
  viewValue: string;
  icon: string;
}

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public _notificationsS: NotificationsService,
    public _updateDS: UpdateDataService,
    public _usersS: UsersService,
    public _webPushNotificationsS: WebPushNotificationsService
  ) {}

  subscriptionsArray: Subscription[] = [];

  currentPage: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  filterValue: string;
  role: Role[] = [
    { value: "ADMIN", viewValue: "Administrador", icon: "fas fa-users-cog" },
    { value: "ASSOCIATED", viewValue: "Asociado", icon: "fas fa-user-tie" },
    { value: "CLIENT", viewValue: "Cliente", icon: "fas fa-user-tag" },
    { value: "NEW", viewValue: "Nuevo", icon: "fas fa-user-plus" },
  ];
  selectedEntry: number = 10;
  users: User[] = [];

  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
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
    this.subscriptionsArray.push(this._usersS.getUsers().subscribe());

    // List Users Subscription
    this.subscriptionsArray.push(
      this._usersS.getUsersList().subscribe((usersList) => {
        this.users = usersList;
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Change Current Pagination Page
  changeEntry($event) {
    this.selectedEntry = $event;
    this.currentPage = 1;
  }

  // Change Rol Of User
  changeRol(id, rol) {
    this.subscriptionsArray.push(
      this._usersS.updateRol(id, rol).subscribe((resp) => {
        if (resp.ok) {
          const newUsersArray = this.users.map((user) =>
            user._id === resp.user._id
              ? { ...user, role: resp.user.role }
              : user
          );

          const newUserRole = this._usersS.getUserRole(resp.user, "update");

          this._usersS.setUsersList(newUsersArray);

          this._notificationsS.message(
            "success",
            `Rol Actualizado`,
            `El usuario ${resp.user.firstName} ${resp.user.lastName} ahora es ${newUserRole}`,
            false,
            true,
            "Aceptar",
            ""
          );

          // Set Notification Data
          this._webPushNotificationsS
            .createNotificationObject(
              this._usersS.user._id,
              null,
              "actualizó tus privilegios de usuario. Ahora eres " + newUserRole,
              "user",
              `perfil/general`,
              this._usersS.user._id,
              this._usersS.getCurrentUserName(),
              this._usersS.user.role,
              resp.user._id
            )
            .then((notificationObject) => {
              // Create Notification With The Specified Data
              const notificationCreatedSub = this._webPushNotificationsS
                .createNotification(notificationObject)
                .subscribe(() => {
                  notificationCreatedSub.unsubscribe();
                });
            });
        }
      })
    );
  }

  // Delete User
  delete(user: User) {
    Swal.fire({
      icon: "warning",
      title: "¿Estas seguro?",
      text:
        "Estas a punto de borrar el usuario " +
        user.firstName +
        " " +
        user.lastName,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.subscriptionsArray.push(
          this._usersS.deleteUser(user._id).subscribe((resp: any) => {
            if (resp.ok) {
              const newUsersArray = this.users.filter(
                (user) => user._id !== resp.user._id
              );
              this._usersS.setUsersList(newUsersArray);
            }
          })
        );
      }
    });
  }

  // Filter Users By Condition
  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  // Open Users Modal
  openUsersModal(idUser?: any) {
    let dialogRef =
      idUser && idUser !== ""
        ? this.dialog.open(UsersFormComponent, {
            data: { idUser, action: "Editar", users: this.users },
            autoFocus: false,
          })
        : this.dialog.open(UsersFormComponent, {
            data: { action: "Crear", users: this.users },
            autoFocus: false,
          });

    // dialogRef.afterClosed().subscribe(result => {
    //   localStorage.removeItem('userData');
    //   localStorage.removeItem('fileData');
    //   this._updateDS.setUserData(null);
    // });
  }

  sendUserId(id: string, view: boolean) {
    this._updateDS.sendUserId(id, view);
  }
}
