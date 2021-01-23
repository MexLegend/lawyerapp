import { Component, OnInit, OnDestroy } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { User } from "src/app/models/User";
import { CloudinaryService } from "src/app/services/cloudinary.service";
import { UsersService } from "src/app/services/users.service";
import { Subscription } from "rxjs";
import { WebPushNotificationsService } from "../../services/webPushNotifications.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(
    public _usersS: UsersService,
    public _cloudinaryS: CloudinaryService,
    public _webPushNotificationsS: WebPushNotificationsService
  ) {
    this.user = this._usersS.user;
  }

  subscriptionsArray: Subscription[] = [];

  public config: PerfectScrollbarConfigInterface = {};

  user: User;

  ngOnInit() {
    this._cloudinaryS.uploaderSend("image");

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
        this.onFileSelected({ url, public_id });
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Update Admin or Lawyer Image
  onFileSelected(image: Object) {
    this._cloudinaryS.setFileType("user");
    this._cloudinaryS.uploader.uploadAll();

    this.subscriptionsArray.push(
      this._usersS.updateImage(this._usersS.user._id, image).subscribe()
    );
  }

  // Update Admin or Lawyer Information
  updateAdmin(user: any) {
    this.user.address = user.adminAddress;
    this.user.biography = user.biography;
    this.user.cellPhone = user.adminCellPhone;
    this.user.email = user.adminEmail;
    this.user.firstName = user.adminFirstName;
    this.user.lastName = user.adminLastName;

    this.subscriptionsArray.push(
      this._usersS.updateUser(this.user._id, this.user).subscribe(() => {
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
      })
    );
  }
}
