import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { Subscription } from "rxjs";

import { CloudinaryService } from "../../../../services/cloudinary.service";
import { MatDialog } from "@angular/material/dialog";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { User } from "../../../../models/User";
import { UsersService } from "../../../../services/users.service";
import { WebPushNotificationsService } from "../../../../services/webPushNotifications.service";

@Component({
  selector: "app-conf-general",
  templateUrl: "./conf-general.component.html",
  styleUrls: ["./conf-general.component.css"],
})
export class ConfGeneralComponent implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    private swUpdate: SwUpdate,
    public _cloudinaryS: CloudinaryService,
    public _usersS: UsersService,
    public _webPushNotificationsS: WebPushNotificationsService
  ) {}

  subscriptionsArray: Subscription[] = [];

  user: User;
  readonly VAPID_PUBLIC_KEY =
    "BFzRa32U-hCa5uiD2nHyiJx_OBHj3v2q9C_-sjyA_xMy2N6E62Uw8GFfGzMa5bQOgxGceTgajzejbTExleHbMXM";

  passAct: string = "";
  passNew: string = "";
  passNewR: string = "";

  public config: PerfectScrollbarConfigInterface = {};

  ngOnInit() {
    this.reloadCache();

    this._cloudinaryS.uploaderSend("image");

    // Get User Data Subscription
    this.subscriptionsArray.push(
      this._usersS
        .getUser(this._usersS.user._id)
        .subscribe((user) => (this.user = user))
    );

    // Validate Invalid Format Files
    this._cloudinaryS.uploader.onWhenAddingFileFailed = (item, filter) => {
      // let message = '';
      // switch (filter.name) {
      //   case 'queueLimit':
      //     message = 'Permitido o envio de no máximo ' + queueLimit + ' arquivos';
      //     break;
      //   case 'fileSize':
      //     message = 'O arquivo ' + item.name + ' possui ' + formatBytes(item.size) + ' que ultrapassa o tamanho máximo permitido de ' + formatBytes(maxFileSize);
      //     break;
      //   default:
      //     message = 'Erro tentar incluir o arquivo';
      //     break;

      this._cloudinaryS.formatInvalidError("img");
    };

    // Get Cloudinary File Uploaded Response
    this.subscriptionsArray.push(
      this._cloudinaryS.getFile().subscribe(({ url, public_id }) => {
        this.updateImage({ url, public_id });
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  updateImage(image: Object) {
    this._cloudinaryS.setFileType("user");
    this._cloudinaryS.uploader.uploadAll();

    this.subscriptionsArray.push(
      this._usersS.updateImage(this._usersS.user._id, image).subscribe()
    );
  }

  reloadCache() {
    if (this.swUpdate.isEnabled) {
      this.subscriptionsArray.push(
        this.swUpdate.available.subscribe(() => {
          if (confirm("Hay una nueva version, desea actualizar?")) {
            window.location.reload();
          }
        })
      );
    }
  }

  updateClient(user: any) {
    this.user.address = user.address;
    this.user.cellPhone = user.cellPhone;
    this.user.email = user.emailU;
    this.user.firstName = user.firstName;
    this.user.lastName = user.lastName;

    this.subscriptionsArray.push(
      this._usersS.updateUser(this.user._id, this.user).subscribe(() => {
        if (this.user.role === "CLIENT") {
          // Set Notification Data
          this._webPushNotificationsS
            .createNotificationObject(
              this.user.img,
              "actualizó su perfil",
              "user",
              `usuarios`,
              this.user._id,
              this._usersS.getCurrentUserName(),
              this.user.role,
              null,
              ["ADMIN"]
            )
            .then((notificationObject) => {
              // Create Notification With The Specified Data
              const notificationCreatedSub = this._webPushNotificationsS
                .createNotification(notificationObject)
                .subscribe(() => {
                  notificationCreatedSub.unsubscribe();
                });
            });
        } else {
          // Set Notification Data
          this._webPushNotificationsS
            .createNotificationObject(
              this.user.img,
              "actualizó su perfil",
              "user",
              `usuarios`,
              this.user._id,
              this._usersS.getCurrentUserName(),
              this.user.role,
              null,
              ["ADMIN"]
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

  updatePass(f: NgForm) {
    const data = {
      passAct: f.value.passAct,
      passNew: f.value.passNew,
      passNewR: f.value.passNewR,
    };

    this.subscriptionsArray.push(
      this._usersS
        .updatePassword(this._usersS.user._id, data)
        .subscribe((resp) => {
          if (resp.ok) {
            f.reset();
          }
        })
    );
  }
}
