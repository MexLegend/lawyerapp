import { Component, OnInit, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { Cases } from "../../models/Cases";
import { User } from "../../models/User";
import { CasesService } from "../../services/cases.service";
import { UpdateDataService } from "../../services/updateData.service";
import { UsersService } from "../../services/users.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NotificationsService } from "../../services/notifications.service";
import { Subscription } from "rxjs";
import { WebPushNotificationsService } from "../../services/webPushNotifications.service";

declare var $: any;

@Component({
  selector: "app-files-form",
  templateUrl: "./files-form.component.html",
  styleUrls: ["./files-form.component.css"],
})
export class FilesFormComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FilesFormComponent>,
    public _casesS: CasesService,
    public _notificationsS: NotificationsService,
    public _usersS: UsersService,
    public _updateData: UpdateDataService,
    public _webPushNotificationsS: WebPushNotificationsService
  ) {}

  subscriptionsArray: Subscription[] = [];

  fileCreation: boolean = true;
  caseModalTitle: string;
  form: FormGroup;
  isChecked: boolean = false;
  isCaseSaved: boolean = false;
  isCaseSaving: boolean = false;
  selectedClientData: any = null;
  users: User[];
  selectedTab = new FormControl(0);
  selectedClientIndex: any;
  activeClientIndex: any;
  public config: PerfectScrollbarConfigInterface = {};

  ngOnInit() {
    // Get Current Selected Client Data Subscription
    this.subscriptionsArray.push(
      this._casesS.getSelectedClientData().subscribe((clientData) => {
        this.selectedClientData = clientData;
      })
    );

    this.initFilesForm();

    // Set Initial Form Values
    if (this.data) {
      this.caseModalTitle = this.data.action;
      this.users = this.data.users;

      if (this.data.idCase && this.data.idCase !== "") {
        this.subscriptionsArray.push(
          this._casesS.getFile(this.data.idCase).subscribe((file) => {
            let nameClient = `${file.assigned_client.firstName} ${file.assigned_client.lastName}`;
            this.form.patchValue({
              actor: file.actor,
              affair: file.affair,
              assigned_client: nameClient,
              assigned_client_id: file.assigned_client._id,
              defendant: file.defendant,
              extKey: file.extKey,
              observations: file.observations,
              third: file.third,
              _id: file._id,
            });
          })
        );
      } else {
        this.form.reset();
      }
    }
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Select file user buttons
  changeButtons(isCreating) {
    this.fileCreation = isCreating;
    if (isCreating) {
      this.selectedClientIndex = this.activeClientIndex;
    } else {
      if (this.selectedClientIndex === this.activeClientIndex) {
        this.isChecked = false;
      }
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  create() {
    this.isCaseSaving = true;
    let propertiesArray = [
      "actor",
      "affair",
      "idClient",
      "defendant",
      "intKey",
      "extKey",
      "observations",
      "third",
    ];

    this.validateFormProperty(propertiesArray).then(
      ([
        actor,
        affair,
        idClient,
        defendant,
        intKey,
        extKey,
        observations,
        third,
      ]) => {
        const caseData = new Cases(
          actor.actor,
          affair.affair,
          idClient.idClient,
          defendant.defendant,
          intKey.intKey,
          extKey.extKey,
          observations.observations,
          third.third
        );

        if (this.form.value._id !== null) {
          // Update File
          this.subscriptionsArray.push(
            this._casesS
              .updateFile(this.form.value._id, caseData)
              .subscribe((resp) => {
                this._notificationsS.message(
                  "success",
                  "Actualización correcta",
                  resp.message,
                  false,
                  false,
                  "",
                  "",
                  2000
                );
                this._casesS.notifica.emit({ render: true });
                this.isCaseSaved = true;

                // Set Notification Data
                this._webPushNotificationsS
                  .createNotificationObject(
                    this._usersS.user._id,
                    null,
                    "actualizó tu caso " + resp.case.affair,
                    "case",
                    `perfil/caso-detalle/${resp.case._id}-${resp.case.assigned_client}`,
                    this._usersS.user._id,
                    this._usersS.getCurrentUserName(),
                    this._usersS.user.role,
                    resp.case.assigned_client
                  )
                  .then((notificationObject) => {
                    // Create Notification With The Specified Data
                    const notificationCreatedSub = this._webPushNotificationsS
                      .createNotification(notificationObject)
                      .subscribe(() => {
                        notificationCreatedSub.unsubscribe();
                      });
                  });

                this.closeModal();
              })
          );
          // Create File
        } else {
          this.subscriptionsArray.push(
            this._casesS.createFile(caseData).subscribe((resp: any) => {
              this.form.reset();
              this._casesS.notifica.emit({ render: true });
              this.isCaseSaved = true;

              // Set Notification Data
              this._webPushNotificationsS
                .createNotificationObject(
                  this._usersS.user._id,
                  null,
                  "te asignó el caso " + resp.case.affair,
                  "case",
                  `perfil/caso-detalle/${resp.case._id}-${resp.case.assigned_client}`,
                  this._usersS.user._id,
                  this._usersS.getCurrentUserName(),
                  this._usersS.user.role,
                  resp.case.assigned_client
                )
                .then((notificationObject) => {
                  // Create Notification With The Specified Data
                  const notificationCreatedSub = this._webPushNotificationsS
                    .createNotification(notificationObject)
                    .subscribe(() => {
                      notificationCreatedSub.unsubscribe();
                    });
                });

              this.closeModal();
            })
          );
        }
      }
    );
  }

  // Init Cases Form
  private initFilesForm() {
    this.form = new FormGroup({
      actor: new FormControl(null, Validators.required),
      affair: new FormControl(null, Validators.required),
      assigned_client: new FormControl(null, Validators.required),
      assigned_client_id: new FormControl(null),
      defendant: new FormControl(null, Validators.required),
      extKey: new FormControl(null),
      observations: new FormControl(null),
      third: new FormControl(null),
      _id: new FormControl(null),
    });
  }

  isCheckedFunction(data: any, index: any) {
    if (
      this.selectedClientIndex !== undefined &&
      this.activeClientIndex !== undefined &&
      this.activeClientIndex === index
    ) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
    this._casesS.setSelectedClientData(data);
  }

  setData() {
    if (this.selectedClientData) {
      const nameClient = `${this.selectedClientData.firstName} ${this.selectedClientData.lastName}`;
      this.activeClientIndex = this.selectedClientIndex;
      this.changeButtons(true);
      this.form.patchValue({
        assigned_client: nameClient,
        assigned_client_id: this.selectedClientData._id,
      });
    }
  }

  // Send Action to Update Data Service
  updateDataServiceAction() {
    this._updateData.dataServiceAction("expediente");
  }

  async validateFormProperty(properties: string[]): Promise<any> {
    let returnedPropertyValue: any[] = properties.map((property) => {
      if (property === "idClient") {
        return {
          [property]: this.form.value.assigned_client_id
            ? this.form.value.assigned_client_id
            : this.selectedClientData._id,
        };
      } else {
        return {
          [property]:
            this.form.value[property] === "" ||
            this.form.value[property] === null
              ? ""
              : this.form.value[property],
        };
      }
    });

    return await new Promise((resolve, reject) =>
      resolve(returnedPropertyValue)
    );
  }
}
