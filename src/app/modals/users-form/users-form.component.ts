import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  Inject,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { CloudinaryService } from "../../services/cloudinary.service";
import { User } from "../../models/User";
import { UsersService } from "../../services/users.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { WebPushNotificationsService } from "../../services/webPushNotifications.service";

declare var $: any;

@Component({
  selector: "app-users-form",
  templateUrl: "./users-form.component.html",
  styleUrls: ["./users-form.component.css"],
})
export class UsersFormComponent implements OnInit, AfterViewChecked {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UsersFormComponent>,
    private ref: ChangeDetectorRef,
    public _cloudinaryS: CloudinaryService,
    public _usersS: UsersService,
    public _webPushNotificationsS: WebPushNotificationsService
  ) {
    this.check();
  }

  subscriptionsArray: Subscription[] = [];

  addressLabel: any;
  emailLabel: any;
  errorEmail: boolean = false;
  form: FormGroup;
  imgData: any = null;
  isUserSaved: boolean = false;
  isUserSaving: boolean = false;
  isUserUpdating: boolean = false;
  lastnameLabel: any;
  nameLabel: any;
  passwordLabel: any;
  passwordLabel2: any;
  roleList = [
    { value: "ADMIN", viewValue: "Administrador" },
    { value: "ASSOCIATED", viewValue: "Asociado" },
    { value: "CLIENT", viewValue: "Cliente" },
    { value: "NEW", viewValue: "Nuevo" },
  ];
  telephoneLabel: any;
  userEmail = new Subject<string>();
  usersList: User[] = [];
  userModalTitle: string;

  public config: PerfectScrollbarConfigInterface = {};

  ngAfterViewChecked() {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.initRegisterForm();
    // Init Cloudinary Uploader Options - Image
    this._cloudinaryS.uploaderSend();

    // Set Cloudinary Uploader File Type - Image
    this._cloudinaryS.setFileUploadType("image", "mainImage");

    // Get Cloudinary File Uploaded Response
    this.subscriptionsArray.push(
      this._cloudinaryS
        .getFile()
        .subscribe(({ url, public_id, size, name }) => {
          this.createNewUserAfterResponse({ url, public_id });
        })
    );

    // Validate Invalid Format Files
    this._cloudinaryS.uploader.onWhenAddingFileFailed = (item, filter) => {
      this._cloudinaryS.formatInvalidError();
    };

    // Create / Update
    if (this.data) {
      this.userModalTitle = this.data.action;
      this.usersList = this.data.users;
      if (this.data.idUser && this.data.idUser !== "") {
        // Get User Data Request
        this.subscriptionsArray.push(
          this._usersS.getUser(this.data.idUser).subscribe()
        );

        // Get User Data Subscription
        this.subscriptionsArray.push(
          this._usersS.getUserData().subscribe((user) => {
            this.requiredPass(this.data.idUser);
            this._cloudinaryS.image = user.img;
            this.form.patchValue({
              address: user.address,
              cellPhone: user.cellPhone,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              password1: user.password,
              role: user.role,
              _id: user._id,
            });
          })
        );
        this.form.get("password1").clearValidators();
        this.form.get("password1").updateValueAndValidity();
        this.form.get("password2").clearValidators();
        this.form.get("password2").updateValueAndValidity();
      } else {
        this._cloudinaryS.image = "no_image";
        this.form.patchValue({
          role: "NEW",
        });
        this.form.controls["password1"].setValidators([
          Validators.required,
          Validators.minLength(9),
        ]);
        this.form.controls["password2"].setValidators([
          Validators.required,
          this.notEqual.bind(this.form),
        ]);
      }
    }
  }

  ngAfterViewInit() {
    this.form
      .get("role")
      .setValue(this._usersS.user.role === "ADMIN" ? "NEW" : "CLIENT");
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  check() {
    this.subscriptionsArray.push(
      this.userEmail
        .pipe(debounceTime(800), distinctUntilChanged())
        .subscribe((value) => {
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            this.subscriptionsArray.push(
              this._usersS.checkEmail(value).subscribe((resp) => {
                if (resp.exist) {
                  this.errorEmail = true;
                } else {
                  this.errorEmail = false;
                }
                if (this.form.value._id !== "") {
                  this.errorEmail = false;
                }
              })
            );
          }
        })
    );
  }

  clearImg() {
    this._cloudinaryS.image = null;
  }

  closeModal() {
    this.form.reset();
    this._cloudinaryS.uploader.clearQueue();
    this.clearImg();
    this.dialogRef.close();
  }

  // Create / Update User
  create() {
    this.isUserSaving = true;
    // Update Existing User
    if (this.form.value._id !== null) {
      // Update just data from existing user
      if (this._cloudinaryS.uploader.queue.length === 0) {
        this.subscriptionsArray.push(
          this._usersS
            .updateUser(this.form.value._id, this.createUserObject(), "")
            .subscribe((resp) => {
              if (resp.ok) {
                const newUsersArray = this.usersList.map((user) =>
                  user._id === resp.user._id ? resp.user : user
                );
                this._usersS.setUsersList(newUsersArray);
                this.isUserSaved = true;
                this.closeModal();
                // Set Notification Data
                this._webPushNotificationsS
                  .createNotificationObject(
                    this._usersS.user._id,
                    null,
                    "actualizó tu perfil",
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
      // Update data and image from existing user
      else {
        this._cloudinaryS.configurateUploaderBeforeUpload().then((resp) => {
          if (resp) {
            this._cloudinaryS.setFileType("user");
            this._cloudinaryS.uploader.uploadAll();
            this.isUserUpdating = true;
          } else {
            console.log("Error al configurar el uploader");
          }
        });
      }
    }
    // Create New User
    else {
      // Create user with just data
      if (this._cloudinaryS.uploader.queue.length === 0) {
        this.subscriptionsArray.push(
          this._usersS
            .createUser(this.createUserObject(), "", localStorage.getItem("id"))
            .subscribe((resp) => {
              if (resp.ok) {
                const newUsersArray = [...this.usersList, resp.user];
                this._usersS.setUsersList(newUsersArray);
                this.isUserSaved = true;
                this.closeModal();
              }
            })
        );
      }
      // Create user with data and image
      else {
        this._cloudinaryS.configurateUploaderBeforeUpload().then((resp) => {
          if (resp) {
            this._cloudinaryS.setFileType("user");
            this._cloudinaryS.uploader.uploadAll();
            this.isUserUpdating = false;
          } else {
            console.log("Error al configurar el uploader");
          }
        });
      }
    }
  }

  // Create New User After Cloudinary Response
  createNewUserAfterResponse(image: any) {
    if (!this.isUserUpdating) {
      this.subscriptionsArray.push(
        this._usersS
          .createUser(
            this.createUserObject(),
            image,
            localStorage.getItem("id")
          )
          .subscribe((resp) => {
            if (resp.ok) {
              const newUsersArray = [...this.usersList, resp.user];
              this._usersS.setUsersList(newUsersArray);
              this.isUserSaved = true;
              this.closeModal();
            }
          })
      );
    } else {
      this.subscriptionsArray.push(
        this._usersS
          .updateUser(this.form.value._id, this.createUserObject(), image)
          .subscribe((resp) => {
            if (resp.ok) {
              this.imgData = null;
              const newUsersArray = this.usersList.map((user) =>
                user._id === resp.user._id ? resp.user : user
              );
              this._usersS.setUsersList(newUsersArray);
              this.form.reset();
              this.isUserSaved = true;
              this.closeModal();
              // Set Notification Data
              this._webPushNotificationsS
                .createNotificationObject(
                  this._usersS.user._id,
                  null,
                  "actualizó tu perfil",
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
  }

  // Create User Object Within Form Data
  createUserObject(): User {
    const { _id: _id, ...userData } = this.form.value;

    // Filter Not Null Values
    Object.keys(userData).forEach(
      (key) => userData[key] == null && delete userData[key]
    );

    return userData;
  }

  private async initRegisterForm() {
    this.form = new FormGroup({
      address: new FormControl(null),
      cellPhone: new FormControl(null),
      email: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      password1: new FormControl(),
      password2: new FormControl(),
      img: new FormControl(null),
      role: new FormControl(null),
      _id: new FormControl(null),
    });
  }

  notEqual(control: FormControl): { [s: string]: boolean } {
    let form: any = this;
    if (control.value !== form.controls["password1"].value) {
      return {
        notEqual: true,
      };
    }
    return null;
  }

  requiredPass(id: string) {
    return id !== "" ? false : true;
  }
}
