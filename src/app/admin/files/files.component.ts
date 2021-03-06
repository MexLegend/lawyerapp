import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
} from "@angular/core";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Cases } from "../../models/Cases";
import { CasesService } from "../../services/cases.service";
import { UpdateDataService } from "../../services/updateData.service";
import { FilesFormComponent } from "../../modals/files-form/files-form.component";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { NotesService } from "../../services/notes.service";
import { EvidencesService } from "../../services/evidences.service";
import { Tracking } from "src/app/models/Tracking";
import { MatBottomSheet } from "@angular/material";
import { ChatService } from "src/app/services/chat.service";
import { NotificationsService } from "src/app/services/notifications.service";
import { TrackingService } from "src/app/services/tracking.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { VolumesService } from "src/app/services/volumes.service";
import { DocumentsViewComponent } from "src/app/modals/documents-view/documents-view.component";
import { SelectEvidenceComponent } from "src/app/modals/select-evidence/select-evidence.component";
import { SelectNotesComponent } from "src/app/modals/select-notes/select-notes.component";
import { UsersService } from "src/app/services/users.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { User } from "../../models/User";
import { Subscription } from "rxjs";
import { WebPushNotificationsService } from "../../services/webPushNotifications.service";

@Component({
  selector: "app-files",
  templateUrl: "./files.component.html",
  styleUrls: ["./files.component.css"],
})
export class FilesComponent implements OnInit {
  constructor(
    private bottomSheet: MatBottomSheet,
    public _chatS: ChatService,
    public dialog: MatDialog,
    public _evidencesS: EvidencesService,
    public _casesS: CasesService,
    public _localStorageS: LocalStorageService,
    public _notesS: NotesService,
    public _notificationsS: NotificationsService,
    private ref: ChangeDetectorRef,
    public _trackingS: TrackingService,
    public _utilitiesS: UtilitiesService,
    public _updateDS: UpdateDataService,
    public _usersS: UsersService,
    public _volumesS: VolumesService,
    public _webPushNotificationsS: WebPushNotificationsService
  ) {}

  subscriptionsArray: Subscription[] = [];

  caseTracking: any;
  currentCaseData: any;
  caseTrackingIndex: number = null;
  currentPage: number = 1;
  currentPage2: number = 1;
  currentPage3: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  cases: any[] = [];
  filterValue: string;
  form: FormGroup;
  notes: any;
  noTrack: any;
  selected = new FormControl(0);
  selectedEntry: number = 10;
  selected2 = new FormControl(0);
  selectedEntry2: number = 10;
  users: User[] = [];

  selectedTrakingAction = new FormControl(0);
  showMoreIndex: number = null;
  trackings: Tracking;
  trakingActionTab = new FormControl(0);
  tracksList: any[] = [];

  selectedNotes: any[] = [];
  volumes: any[] = [];
  lastVolume: any;
  myarrayLength;
  selectedEvidences: any[] = [];
  userClientExist = false;

  public config: PerfectScrollbarConfigInterface = {};
  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;

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

    // List Cases from Response
    this.getByLowyer();
    this.initCaseMessageForm();

    // Get Selected Evidences Subscription
    this.subscriptionsArray.push(
      this._evidencesS.getSelectedEvidencesSub().subscribe((evidence) => {
        this.selectedEvidences = evidence;
      })
    );

    // Get Selected Notes Subscription
    this.subscriptionsArray.push(
      this._notesS.getSelectedNotesSub().subscribe((note) => {
        this.selectedNotes = note;
      })
    );

    // Load storage property if exists
    this._localStorageS
      .getLocalStoragePropertyIfExists([
        "evidences",
        "notes",
        "message",
        "trackingCaseData",
        "caseTrackingIndex",
      ])
      .map((item) => {
        switch (Object.keys(item)[0]) {
          case "trackingCaseData":
            this.currentCaseData = JSON.parse(item.trackingCaseData);
            break;
          case "notes":
            this._notesS.setCheckNotesFromStorage(JSON.parse(item.notes));
            this._notesS.setShowingListedNotes(true);
            break;
          case "evidences":
            this._evidencesS.setCheckEvidencesFromStorage(
              JSON.parse(item.evidences)
            );
            this._evidencesS.setShowingListedEvidences(true);
            break;
          case "message":
            this.form.patchValue({
              message: JSON.parse(item.message),
            });
            break;
          default:
            this.caseTrackingIndex = item.caseTrackingIndex;
            break;
        }
      });

    // Get Users Supcription
    this.subscriptionsArray.push(this._usersS.getUsers().subscribe());

    // List Users Subscription
    this.subscriptionsArray.push(
      this._usersS.getUsersList().subscribe((usersList) => {
        usersList.map((user) => {
          if (user.role === "CLIENT") {
            this.userClientExist = true;
          }
        });

        this.users = usersList;
      })
    );

    // Get Active Tab Subscription
    this.subscriptionsArray.push(
      this._trackingS.getActiveCaseTabSub().subscribe((activeTab) => {
        this.selected.setValue(activeTab);
      })
    );

    // Get Cases Data Subscription
    this.subscriptionsArray.push(
      this._trackingS.getCasesDataSub().subscribe((casesData) => {
        this.cases = casesData;
      })
    );

    // Get Current CaseData Subscription
    this.subscriptionsArray.push(
      this._trackingS.getCurrentCaseDataSub().subscribe((caseData) => {
        this.currentCaseData = caseData;
      })
    );

    // Get Current Case Volumes Subscription
    this.subscriptionsArray.push(
      this._trackingS
        .getCurrentCaseVolumesSub()
        .subscribe(([volumes, lastVolume]) => {
          this.volumes = volumes;
          this.lastVolume = lastVolume;
        })
    );

    // Get Current Case Trackings Subscription
    this.subscriptionsArray.push(
      this._trackingS.getTrackIdSub().subscribe(({ track, action }) => {
        if (action === "new") {
          this.tracksList = this.reorderTrackingIndex(track, "list");
        } else if (action === "delete") {
          const newTracksList = this.tracksList.filter(
            (trackL) => trackL._id !== track.tracking._id
          );
          this.tracksList = this.reorderTrackingIndex(newTracksList, "delete");
        } else {
          this.tracksList = this.reorderTrackingIndex(track, "list");
        }
      })
    );

    // Get Current Tracking Index Subscription
    this.subscriptionsArray.push(
      this._trackingS.getCurrentTrackIndexSub().subscribe((index) => {
        this.caseTrackingIndex = index;
      })
    );

    // Get Tracking Case Message Subscription
    this.subscriptionsArray.push(
      this._trackingS.getTrackingMessageValueSub().subscribe((message) => {
        this.form.patchValue({
          message: JSON.parse(message),
        });
      })
    );

    // Reload Cases List After Been Modified
    this.subscriptionsArray.push(
      this._casesS.notifica.subscribe(() => this.getByLowyer())
    );

    // Get Active Read More Index Subscription
    this.subscriptionsArray.push(
      this._utilitiesS.getShowMoreIndexSub().subscribe((index) => {
        this.showMoreIndex = index;
      })
    );
  }

  ngAfterViewInit() {
    this.ref.detectChanges();
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  addMessage() {
    const message = this.form.value.message;
    this._trackingS.setTrackingMessageValueSub(message);
    this._localStorageS.addLocalStorageItem("message", message);
  }

  // Change Current Pagination Page
  changeEntry($event) {
    this.selectedEntry = $event;
    this.currentPage = 1;
  }

  changeCaseStatus(caseData: any, status: string) {
    const action = status === "ARCHIVED" ? "archivar" : "activar";
    const socketTitleAction = status === "ARCHIVED" ? "archivó" : "activó";

    Swal.fire({
      icon: "info",
      title: `¿Seguro que desea ${action} el caso: ${caseData.affair}?`,
      text: `Cliente asignado: ${caseData.assigned_client[0].firstName} ${caseData.assigned_client[0].lastName}`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.subscriptionsArray.push(
          this._casesS
            .updateCaseStatus(caseData._id, status)
            .subscribe((resp) => {
              if (resp.ok) {
                this._casesS.notifica.emit({ render: true });

                // Set Notification Data
                this._webPushNotificationsS
                  .createNotificationObject(
                    this._usersS.user._id,
                    null,
                    socketTitleAction + " tu caso " + resp.case.affair,
                    "case",
                    `perfil/casos`,
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
              }
            })
        );
      }
    });
  }

  // Change Tracking Status Delete / Activate
  changeStatus(status: string, tracking: any) {
    let action = status === "DELETED" ? "eliminar" : "activar";

    Swal.fire({
      icon: "warning",
      title: `¿Seguro que desea ${action} el evento: #${tracking.index}?`,
      text: `Caso: ${this.currentCaseData.affair}`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f8b407",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        const statusN = {
          status,
        };
        this.subscriptionsArray.push(
          this._trackingS
            .changeStatusTracking(tracking._id, statusN)
            .subscribe((resp) => {
              this._trackingS.notifica.emit({ newTrack: true });
              this._trackingS.setTrackIdSub(resp, "delete");

              // Set Notification Data
              this._webPushNotificationsS
                .createNotificationObject(
                  this._usersS.user._id,
                  null,
                  "elimino el evento #" +
                    Number(tracking.index) +
                    " del caso " +
                    this.currentCaseData.affair,
                  "case-event",
                  `perfil/caso-detalle/${this.currentCaseData._id}-${this.currentCaseData.assigned_client[0]._id}`,
                  this._usersS.user._id,
                  this._usersS.getCurrentUserName(),
                  this._usersS.user.role,
                  this.currentCaseData.assigned_client[0]._id
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
    });
  }

  createTracking() {
    let trackingActionMessage: string = "";
    const [
      isCurrentTrackingCaseInStorage,
      isTrackingBeingCreated,
      isCurrentTrackingUpdating,
    ] = this._trackingS.trackingPropertiesValidation(
      "create",
      this.currentCaseData._id
    );

    // Validate If LocalStorage Tracking Properties Exists
    if (isTrackingBeingCreated || isCurrentTrackingUpdating) {
      // Validate If Any Case Tracking Is Being Updated
      if (isCurrentTrackingUpdating) {
        if (!isCurrentTrackingCaseInStorage) {
          trackingActionMessage = `Tienes el evento <b>#${this.caseTrackingIndex}</b> en proceso de actualización<br>`;
        } else {
          trackingActionMessage =
            `Tienes un evento en proceso de actualización en el caso<br>` +
            `<b>${
              JSON.parse(localStorage.getItem("trackingCaseData")).affair
            }</b>.<br>`;
        }
        this._trackingS.callTrackingCreationSwalModal(
          trackingActionMessage,
          this.currentCaseData
        );
      }
      // Validate If Any Case Tracking Is Being Created
      else if (isTrackingBeingCreated) {
        // Compare If LocaStorage Tracking ID Is Different To Current One
        if (isCurrentTrackingCaseInStorage) {
          trackingActionMessage =
            `Tienes otro evento sin finalizar en el caso<br>` +
            `<b>${
              JSON.parse(localStorage.getItem("trackingCaseData")).affair
            }</b>.<br>`;
          this._trackingS.callTrackingCreationSwalModal(
            trackingActionMessage,
            this.currentCaseData
          );
        } else {
          this._localStorageS.addLocalStorageItem(
            "trackingCaseData",
            this.currentCaseData
          );
          this._trackingS.setCurrentTrackIndexSub(null);
          this.selected.setValue(4);
        }
      }
    } else {
      this._localStorageS.addLocalStorageItem(
        "trackingCaseData",
        this.currentCaseData
      );
      this._trackingS.setCurrentTrackIndexSub(null);
      this.selected.setValue(4);
    }
  }

  // Delete Case
  delete(caseData: Cases) {
    Swal.fire({
      icon: "warning",
      title: "¿Esta seguro?",
      text: "Esta a punto de borrar el caso " + caseData.affair,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f8b407",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.subscriptionsArray.push(
          this._casesS.deleteFile(caseData._id).subscribe((resp: any) => {
            this.getByLowyer();
            // Set Notification Data
            this._webPushNotificationsS
              .createNotificationObject(
                this._usersS.user._id,
                null,
                "eliminó tu caso " + resp.case.affair,
                "case",
                `perfil/casos`,
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
          })
        );
      }
    });
  }

  editTrack(trackingData: any) {
    let trackingActionMessage: string = "";
    const [
      isCurrentTrackingCaseInStorage,
      isCurrentTrackingBeingCreated,
      isCurrentTrackingUpdating,
    ] = this._trackingS.trackingPropertiesValidation(
      "edit",
      this.currentCaseData._id
    );
    const IsSameTrackingIndex = this._trackingS.isCurrentTrackingBeingUpdated(
      trackingData.index
    );

    // Validate If Current Case Tracking Is Been Updating
    if (isCurrentTrackingUpdating) {
      // Validate If Current Tracking Update Is In The Same Case
      if (!isCurrentTrackingCaseInStorage) {
        // Compare If Current Tracking Index Is Equal To LocalStorage One
        if (IsSameTrackingIndex) {
          this._localStorageS
            .getLocalStoragePropertyIfExists(["trackingCaseData"])
            .map((item) => {
              this._trackingS.setCurrentCaseDataSub(
                JSON.parse(item.trackingCaseData)
              );
            });
          this.selected.setValue(4);
          return;
        }
        // Warning Message When Current Tracking Index Is Different To LocalStorage One In Same Case
        else {
          trackingActionMessage = `Tienes el evento <b>#${this.caseTrackingIndex}</b> en proceso de actualización<br>`;
        }
      }
      // Warning Message When Edit Button Clicked From Different Case
      else {
        trackingActionMessage =
          `Tienes un evento en proceso de actualización en el caso<br>` +
          `<b>${
            JSON.parse(localStorage.getItem("trackingCaseData")).affair
          }</b>.<br>`;
      }
      this._trackingS.callTrackingUpdateSwalModal(
        trackingActionMessage,
        this.currentCaseData,
        trackingData
      );
    } else {
      // Validate If LocalStorage Tracking Creation Properties Exists
      if (
        this._localStorageS.isPropertyInLocalStorage([
          "notes",
          "evidences",
          "message",
        ])
      ) {
        // Compare If Current Tracking Index Is Equal To LocalStorage One
        if (this._trackingS.isCurrentTrackingBeingUpdated(trackingData.index)) {
          trackingActionMessage = `Tienes otro evento sin finalizar en este caso.<br>`;
        } else {
          trackingActionMessage =
            `Tienes otro evento sin finalizar en el caso<br>` +
            `<b>${
              JSON.parse(localStorage.getItem("trackingCaseData")).affair
            }</b>.<br>`;
        }
        this._trackingS.callTrackingUpdateSwalModal(
          trackingActionMessage,
          this.currentCaseData,
          trackingData
        );
      } else {
        this._trackingS.updateCurrentTracking(
          this.currentCaseData,
          trackingData
        );
      }
    }
  }

  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  // Finish Tracking Creation
  finish() {
    let trackingAction: string = "enviar";
    let isTrackingUpdating: boolean = false;
    let trackingIndex: number = this.currentCaseData.tracks.length + 1;
    if (this._localStorageS.isPropertyInLocalStorage(["isTrackingUpdating"])) {
      trackingAction = "editar";
      isTrackingUpdating = true;
      this._localStorageS
        .getLocalStoragePropertyIfExists(["caseTrackingIndex"])
        .map((item) => (trackingIndex = item.caseTrackingIndex));
    }

    Swal.fire({
      icon: "info",
      title:
        "<div>¿Seguro que deseas " +
        trackingAction +
        " el evento: " +
        "<u>" +
        `#${trackingIndex}` +
        "</u>?</div>",
      html:
        "<div><span>" +
        "Se enviará una notificación al cliente <b>" +
        `${this.currentCaseData.assigned_client[0].firstName} ${this.currentCaseData.assigned_client[0].lastName}` +
        "</b>" +
        " acerca del caso <b>" +
        `${this.currentCaseData.affair}` +
        "</b></span></div>",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        let caseTrackingId: any = "",
          evidenceId: any = "",
          evidences: any[] = [],
          noteId: any = "",
          notes: any[] = [],
          message: any = "";

        this._localStorageS
          .getLocalStoragePropertyIfExists([
            "caseTrackingId",
            "evidenceId",
            "evidences",
            "noteId",
            "notes",
            "message",
          ])
          .map((item) => {
            switch (Object.keys(item)[0]) {
              case "caseTrackingId":
                return (caseTrackingId = item.caseTrackingId);
              case "evidenceId":
                return (evidenceId = item.evidenceId);
              case "evidences":
                return (evidences = item.evidences);
              case "noteId":
                return (noteId = item.noteId);
              case "notes":
                return (notes = item.notes);
              default:
                return (message = JSON.parse(item.message));
            }
          });

        if (isTrackingUpdating) {
          this.subscriptionsArray.push(
            this._trackingS
              .updateTracking(
                caseTrackingId,
                evidenceId,
                evidences,
                noteId,
                notes,
                message
              )
              .subscribe((resp) => {
                this._trackingS.setCaseTrackingsData(
                  resp,
                  "edit",
                  this.cases,
                  this.currentCaseData,
                  trackingIndex
                );
                // Set Notification Data
                this._webPushNotificationsS
                  .createNotificationObject(
                    this._usersS.user._id,
                    null,
                    "actualizó el evento #" +
                      Number(trackingIndex) +
                      " del caso " +
                      this.currentCaseData.affair,
                    "case-event",
                    `perfil/caso-detalle/${this.currentCaseData._id}-${this.currentCaseData.assigned_client[0]._id}`,
                    this._usersS.user._id,
                    this._usersS.getCurrentUserName(),
                    this._usersS.user.role,
                    this.currentCaseData.assigned_client[0]._id
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
        } else {
          this.subscriptionsArray.push(
            this._trackingS
              .createTracking(
                localStorage.getItem("volume"),
                evidenceId,
                evidences,
                noteId,
                notes,
                message
              )
              .subscribe((resp) => {
                this._trackingS.setCaseTrackingsData(
                  resp,
                  "new",
                  this.cases,
                  this.currentCaseData
                );

                // Set Notification Data
                this._webPushNotificationsS
                  .createNotificationObject(
                    this._usersS.user._id,
                    null,
                    "te envió un nuevo evento del caso " +
                      this.currentCaseData.affair,
                    "case-event",
                    `perfil/caso-detalle/${this.currentCaseData._id}-${this.currentCaseData.assigned_client[0]._id}`,
                    this._usersS.user._id,
                    this._usersS.getCurrentUserName(),
                    this._usersS.user.role,
                    this.currentCaseData.assigned_client[0]._id
                  )
                  .then((notificationObject) => {
                    // Create Notification With The Specified Data
                    const notificationCreatedSub = this._webPushNotificationsS
                      .createNotification(notificationObject)
                      .subscribe(() => {
                        notificationCreatedSub.unsubscribe;
                      });
                  });
              })
          );
        }
      }
    });
  }

  getByLowyer() {
    this.subscriptionsArray.push(
      this._trackingS.getByClient().subscribe((cases) => {
        if (cases.length > 0) {
          this._trackingS.setCasesDataSub(cases);
          this.userClientExist = true;
        } else {
          this.getUsersByLawyer();
        }
      })
    );
  }

  // Get Existing Client Users
  getUsersByLawyer() {
    this.subscriptionsArray.push(this._usersS.getUsers().subscribe());
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  initCaseMessageForm() {
    this.form = new FormGroup({
      message: new FormControl(null, Validators.required),
    });
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  open(url) {
    window.open(`http://${url}`, "_blank");
  }

  openDocuments(track) {
    let evidencesAll: any[] = [];
    this.subscriptionsArray.push(
      this._evidencesS
        .getEvidence(this._trackingS.caseData._id)
        .subscribe((resp) => {
          if (resp && resp !== null) {
            resp.evidences.map((evidenceBD) => {
              track.trackingEvidences.map((evidenceTrack) => {
                if (evidenceBD._id === evidenceTrack.evidence) {
                  evidencesAll.push(evidenceBD.evidence);
                }
              });
            });
          } else {
            evidencesAll = [];
          }
        })
    );

    this.bottomSheet.open(DocumentsViewComponent, {
      data: { evidences: evidencesAll },
    });
  }

  // Open Files Modal
  openCasesModal(caseData?: any) {
    let IDFile = caseData && caseData ? true : false;

    if (IDFile) {
      this.viewNotesList(caseData);
    }

    let dialogRef = IDFile
      ? this.dialog.open(FilesFormComponent, {
          data: {
            idCase: caseData._id,
            action: "Actualizar",
            users: this.users,
          },
          autoFocus: false,
        })
      : this.dialog.open(FilesFormComponent, {
          data: { action: "Crear", users: this.users },
          autoFocus: false,
        });

    this.subscriptionsArray.push(
      dialogRef.afterClosed().subscribe(() => {
        localStorage.removeItem("userData");
        localStorage.removeItem("fileData");
        this._updateDS.setUserData(null);
      })
    );
  }

  openSelectEvidences(viewDetails?: string, trackingData?: any) {
    let dialogRef = this.dialog.open(SelectEvidenceComponent, {
      data: { viewDetails, trackingData, caseData: this.currentCaseData },
      autoFocus: false,
      panelClass: "evidences-view-modal",
    });

    this.subscriptionsArray.push(
      dialogRef.afterOpened().subscribe(() => {
        this._evidencesS.setCaseIdSub(
          "select",
          "trackingCaseData",
          this.currentCaseData
        );
      })
    );

    this.subscriptionsArray.push(
      dialogRef.afterClosed().subscribe(() => {
        this._evidencesS.clearNotListedEvidences();
      })
    );
  }

  openSelectNotes() {
    let dialogRef = this.dialog.open(SelectNotesComponent, {
      data: {},
      autoFocus: false,
      panelClass: "notes-view-modal",
    });
    this.subscriptionsArray.push(
      dialogRef.afterOpened().subscribe(() => {
        this._notesS.setCaseIdSub(
          "select",
          "trackingCaseData",
          this.currentCaseData
        );
        this._notesS.setListedNotesSub("create", this.currentCaseData._id);
      })
    );

    this.subscriptionsArray.push(
      dialogRef.afterClosed().subscribe(() => {
        this._notesS.clearNotListedNotes();
      })
    );
  }

  orderIndex(track, idx) {
    let reversedTrackListIndex = track.map((t, index) => index);
    let trackListIndex = reversedTrackListIndex.find((trackIndex, index) => {
      index === idx ? trackIndex : null;
    });
    return trackListIndex;
  }

  reorderTrackingIndex(tracks: any, action: string): any {
    if (action === "list") {
      return tracks.map((track, idx) =>
        Object.assign({ index: tracks.length - idx }, track)
      );
    } else {
      return tracks.map((track, idx) => {
        track.index = tracks.length - idx;
        return track;
      });
    }
  }

  trackItem(index: number, item: any) {
    return item._id;
  }

  trackFilesAllBy(index: number): number {
    return index;
  }

  updateListedEvidences(evidence: string) {
    this._evidencesS.setCheckEvidences(evidence, "uncheck");
    this._evidencesS.setShowingListedEvidences();
    this._localStorageS.updateStorageItem(evidence, "evidences");
  }

  updateListedNotes(note: string) {
    this._notesS.setCheckNotes(note, "uncheck");
    this._notesS.setShowingListedNotes();
    this._localStorageS.updateStorageItem(note, "notes");
  }

  // View Files List Function
  viewEvidencesList(caseData: any) {
    this._evidencesS.setCaseIdSub("list", "caseData", caseData);
    if (caseData.status === "ARCHIVED") {
      this._casesS.setIsCaseArchived(true);
    } else {
      this._casesS.setIsCaseArchived(false);
    }
  }

  viewNotesList(caseData: any) {
    this._localStorageS.addLocalStorageItem("caseData", caseData);
    this._notesS.setListedNotesSub("create", caseData._id);
    if (caseData.status === "ARCHIVED") {
      this._casesS.setIsCaseArchived(true);
    } else {
      this._casesS.setIsCaseArchived(false);
    }
  }

  // View Case Tracking List
  viewCaseTrackingList(caseData: any) {
    this._trackingS.getVolumes(caseData.volumes);
    this.tracksList = this.reorderTrackingIndex(caseData.tracks, "list");
    this._trackingS.setCurrentCaseDataSub(caseData);
    this.selected.setValue(3);
  }
}
