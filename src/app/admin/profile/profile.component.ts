import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { User } from "src/app/models/User";
import { CloudinaryService } from "src/app/services/cloudinary.service";
import { UsersService } from "src/app/services/users.service";
import { Subscription } from "rxjs";
import { WebPushNotificationsService } from "../../services/webPushNotifications.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  MatTabGroup,
  MatDialog,
  MatSelect,
  MatOption,
} from "@angular/material";
import { UtilitiesService } from "../../services/utilities.service";
import { PracticeAreasService } from "../../services/practice-areas.service";
import { PracticeAreasFormComponent } from "../../modals/practice-areas-form/practice-areas-form.component";
import { PracticeArea } from "../../models/PracticeArea";

import { ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    public _usersS: UsersService,
    public _cloudinaryS: CloudinaryService,
    private _practiceAreaS: PracticeAreasService,
    public _utilitiesS: UtilitiesService,
    public _webPushNotificationsS: WebPushNotificationsService
  ) {
    this.user = this._usersS.user;
  }

  /** Subject That Emits When The Component Has Been Destroyed. */
  protected _onDestroy = new Subject<void>();
  subscriptionsArray: Subscription[] = [];

  public config: PerfectScrollbarConfigInterface = {};

  activeAction: string = null;
  practiceAreas: Array<any> = [];

  /** Control For The MatSelect Filter Keyword Multi-Selection */
  public practiceAreasFilterCtrl: FormControl = new FormControl();

  /** List Of Array Items Filtered By Search Keyword */
  public practiceAreasMulti: ReplaySubject<
    Array<PracticeArea>
  > = new ReplaySubject<Array<PracticeArea>>(1);

  public tooltipMessage = "Select All / Unselect All";

  @ViewChild("practiceAreaSelect", { static: true })
  practiceAreaSelect: MatSelect;

  user: User;
  userProfileForm: FormGroup;
  selected = new FormControl(0);
  selectAction: any = { action: "Seleccionar", isSelectingAll: false };

  ngOnInit() {
    this._cloudinaryS.uploaderSend("image");

    // Get User Data Request
    this.subscriptionsArray.push(
      this._usersS.getUser(this._usersS.user._id).subscribe()
    );

    // Get User Data Subscription
    this.subscriptionsArray.push(
      this._usersS.getUserData().subscribe((user) => {
        this.user = user;
      })
    );

    // Get Practice Areas Supcription
    this.subscriptionsArray.push(
      this._practiceAreaS.getPracticeAreas("ALL").subscribe()
    );

    // List Practice Areas Subscription
    this.subscriptionsArray.push(
      this._practiceAreaS
        .getPracticeAreasList()
        .subscribe(([practiceAreasList, action]) => {
          practiceAreasList.map(
            (practiceArea) =>
              (this.practiceAreas = this._utilitiesS.upsertArrayItems(
                this.practiceAreas,
                practiceArea,
                action
              ))
          );

          // Load The Initial Practice Areas List
          this.practiceAreasMulti.next(this.practiceAreas.slice());
          this.setInitialValue();
        })
    );

    // Listen For Search Field Value Changes
    this.practiceAreasFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });

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
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // Filter Practice Areas List
  filterPracticeAreas(filterValue: any) {
    this.practiceAreas = this._utilitiesS.filterArray(filterValue, "name");
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
      biography: new FormControl(
        this.user.biography,
        activeAction === "Biografía" ? Validators.required : null
      ),
      practiceAreas: new FormControl(
        this.user.practice_areas && this.user.practice_areas.length > 0
          ? [
              ...this.practiceAreas.filter((practiceArea: PracticeArea) =>
                this.user.practice_areas.some(
                  (practiceAreaLawyer: any) =>
                    practiceAreaLawyer.practice_area === practiceArea._id
                )
              ),
            ]
          : [],
        activeAction === "Áreas de práctica" ? Validators.required : null
      ),
    });
  }

  // Open Practice Areas Modal
  openPracticeAreasModal() {
    let dialogRef = this.dialog.open(PracticeAreasFormComponent, {
      id: "simplePracticeAreaModal",
      panelClass: "simplePracticeAreaModal",
      data: {
        action: "Crear Área de Práctica",
        type: "Simple",
        is_category: false,
      },
      width: "600px",
      height: "400px",
      autoFocus: false,
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   localStorage.removeItem('userData');
    //   localStorage.removeItem('fileData');
    //   this._updateDS.setUserData(null);
    // });
  }

  // Reset Filter Input
  resetInputFilter(input: any) {
    this.practiceAreas = this._utilitiesS.resetFilterInput(input);
  }

  // Select / Unselect All Mat-Select Options
  selectUnselect(selectHandler: MatOption, action: string) {
    if (action === "selectAll") {
      if (!this.selectAction.isSelectingAll) {
        this.selectAction = { action: "Deseleccionar", isSelectingAll: true };
        this.userProfileForm.controls["practiceAreas"].setValue([
          ...this.practiceAreas.map(
            (practiceArea: PracticeArea) => practiceArea.name
          ),
        ]);
      } else {
        this.selectAction = { action: "Seleccionar", isSelectingAll: false };
        this.userProfileForm.controls["practiceAreas"].setValue([]);
      }
    } else {
      // selectHandler.map((item: any) =>
      //   item._id === select.value ? (select.checked = true) : select.checked
      // );
    }
  }

  setActiveAction(tabGroup: MatTabGroup, action: string, activeTab: number) {
    this.initUserForm(action);
    this.activeAction = action;
    this.selected.setValue(activeTab);

    this._utilitiesS.setActiveTab(tabGroup, activeTab);
  }

  // Update Admin or Lawyer Information
  updateUserData(userProfileTabGroup: any) {
    if (this.activeAction === "Áreas de práctica") {
      const practiceAreas = this.userProfileForm.value.practiceAreas.map(
        ({ _id: idPracticeArea, ...practiceAreaData }) => ({
          practice_area: idPracticeArea,
        })
      );

      this._usersS.updateAction(
        this.activeAction,
        { ...this.userProfileForm.value, practiceAreas: practiceAreas },
        userProfileTabGroup,
        0,
        this._webPushNotificationsS
      );
    } else {
      this._usersS.updateAction(
        this.activeAction,
        this.userProfileForm.value,
        userProfileTabGroup,
        0,
        this._webPushNotificationsS
      );
    }
  }

  // Update Admin or Lawyer Image
  updateImage(image?: Object) {
    this._cloudinaryS.setFileType("user");
    this._cloudinaryS.uploader.uploadAll();

    this.subscriptionsArray.push(
      this._usersS.updateImage(this._usersS.user._id, image).subscribe()
    );
  }

  /**
   * Sets The Initial Value After The Practice Areas Are Loaded Initially
   */
  protected setInitialValue() {
    this.practiceAreasMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        if (this.practiceAreaSelect)
          this.practiceAreaSelect.compareWith = (
            a: PracticeArea,
            b: PracticeArea
          ) => a && b && a._id === b._id;
      });
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.practiceAreasMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((practiceAreasList) => {
        if (selectAllValue) {
          this.userProfileForm.controls["practiceAreas"].setValue([
            ...practiceAreasList.map(
              (practiceArea: PracticeArea) => practiceArea
            ),
          ]);
        } else {
          this.userProfileForm.controls["practiceAreas"].setValue([]);
        }
      });
  }

  protected filterBanksMulti() {
    if (!this.practiceAreas) {
      return;
    }
    // Get The Search Keyword
    let search = this.practiceAreasFilterCtrl.value;
    if (!search) {
      this.practiceAreasMulti.next(this.practiceAreas.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // Filter The Practice Areas
    this.practiceAreasMulti.next(
      this.practiceAreas.filter(
        (practiceArea) => practiceArea.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getLawyerPracticeAreas(): any {
    const practiceAreasList = this.practiceAreas
      .filter((practiceArea: PracticeArea) =>
        this.user.practice_areas.some(
          (practiceAreaLawyer: any) =>
            practiceAreaLawyer.practice_area === practiceArea._id
        )
      )
      .map((practiceAreaObtained) => practiceAreaObtained.name);

    return practiceAreasList;
  }
}
