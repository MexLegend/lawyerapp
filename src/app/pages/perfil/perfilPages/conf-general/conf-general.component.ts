import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, NgForm, FormGroup, Validators } from "@angular/forms";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { Subscription } from "rxjs";

import { CloudinaryService } from "../../../../services/cloudinary.service";
import { MatDialog } from "@angular/material/dialog";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { User } from "../../../../models/User";
import { UsersService } from "../../../../services/users.service";
import { WebPushNotificationsService } from "../../../../services/webPushNotifications.service";
import { MatTabGroup } from "@angular/material";
import { UtilitiesService } from "../../../../services/utilities.service";

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
    private _utilitiesS: UtilitiesService,
    public _webPushNotificationsS: WebPushNotificationsService
  ) {}

  readonly VAPID_PUBLIC_KEY =
    "BFzRa32U-hCa5uiD2nHyiJx_OBHj3v2q9C_-sjyA_xMy2N6E62Uw8GFfGzMa5bQOgxGceTgajzejbTExleHbMXM";

  subscriptionsArray: Subscription[] = [];

  activeAction: string = null;
  public config: PerfectScrollbarConfigInterface = {};
  userProfileForm: FormGroup;
  selected = new FormControl(0);
  user: User;

  ngOnInit() {
    this.reloadCache();

    // Init Cloudinary Uploader Options - Image
    this._cloudinaryS.uploaderSend();

    // Set Cloudinary Uploader File Type - Image
    this._cloudinaryS.setFileUploadType("image", "mainImage");

    // Get User Data Request
    this.subscriptionsArray.push(
      this._usersS.getUser(this._usersS.user._id).subscribe()
    );

    // Get User Data Subscription
    this.subscriptionsArray.push(
      this._usersS.getUserData().subscribe((user) => {
        this.user = user;
        this._cloudinaryS.image = user?.img;
      })
    );

    // Validate Invalid Format Files
    this._cloudinaryS.uploader.onWhenAddingFileFailed = (item, filter) => {
      this._cloudinaryS.formatInvalidError();
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

  // Init User Form
  private initUserForm(activeAction: string) {
    this.userProfileForm = new FormGroup({
      firstName: new FormControl(
        this.user.firstName,
        activeAction === "Nombre" ? Validators.required : null
      ),
      lastName: new FormControl(
        this.user.lastName,
        activeAction === "Nombre" ? Validators.required : null
      ),
      newPassword: new FormControl(
        null,
        activeAction === "Contraseña" ? Validators.required : null
      ),
      confirmNewPassword: new FormControl(
        null,
        activeAction === "Contraseña" ? Validators.required : null
      ),
      userEmail: new FormControl(
        this.user.email,
        activeAction === "Email" ? Validators.required : null
      ),
      cellPhone: new FormControl(
        this.user.cellPhone,
        activeAction === "Teléfono" ? Validators.required : null
      ),
      address: new FormControl(
        this.user.address,
        activeAction === "Dirección" ? Validators.required : null
      ),
    });
  }

  updateImage(image?: Object) {
    this._cloudinaryS.configurateUploaderBeforeUpload().then((resp) => {
      if (resp) {
        this._cloudinaryS.setFileType("user");
        this._cloudinaryS.uploader.uploadAll();
      } else {
        console.log("Error al configurar el uploader");
      }
    });

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

  updateUserData(userProfileTabGroup: any) {
    this._usersS.updateAction(
      this.activeAction,
      this.userProfileForm.value,
      userProfileTabGroup,
      0,
      this._webPushNotificationsS
    );
  }

  setActiveAction(tabGroup: MatTabGroup, action: string, activeTab: number) {
    this.initUserForm(action);
    this.activeAction = action;
    this.selected.setValue(activeTab);

    this._utilitiesS.setActiveTab(tabGroup, activeTab);
  }
}
