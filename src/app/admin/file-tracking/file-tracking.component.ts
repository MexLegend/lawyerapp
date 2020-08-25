import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  HostListener
} from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { DocumentsViewComponent } from "../../modals/documents-view/documents-view.component";
import { Tracking } from "../../models/Tracking";
import { TrackingService } from "../../services/tracking.service";
import { NotificationsService } from "../../services/notifications.service";
import { UpdateDataService } from "../../services/updateData.service";
import { FilesService } from '../../services/files.service';
import { SelectEvidenceComponent } from '../../modals/select-evidence/select-evidence.component';
import { SelectNotesComponent } from '../../modals/select-notes/select-notes.component';
import { NotesService } from '../../services/notes.service';

declare var $: any;

@Component({
  selector: "app-file-tracking",
  templateUrl: "./file-tracking.component.html",
  styleUrls: ["./file-tracking.component.css"],
})
export class FileTrackingComponent implements OnInit, AfterViewInit {
  constructor(
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private ref: ChangeDetectorRef,
    public _fileS: FilesService,
    public _notesS: NotesService,
    public _notificationsS: NotificationsService,
    public _trackingS: TrackingService,
    private _updateDataS: UpdateDataService,
  ) { }

  caseTracking: any;
  currentPage: number = 1;
  currentPage2: number = 1;
  entriesFilter: any[] = [1, 5, 10, 20, 50, 100, 200];
  filesAll: any = [];
  filterValue: string;
  form: FormGroup;
  noTrack: any;
  selected = new FormControl(0);
  selectedEntry: number = 5;
  selectedTrakingAction = new FormControl(0);
  tracking: boolean;
  trackings: Tracking;
  trakingActionTab = new FormControl(0);
  updating: boolean;

  notesSelect: any[] = [];

  public config: PerfectScrollbarConfigInterface = {};
  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;

  ngAfterViewInit() {
    this.ref.detectChanges();
  }

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
    this.getByLowyer();
    this.initFileForm();

    this._trackingS.fileStorage = localStorage.getItem("fileData")
      ? true
      : false;
    this.tracking = localStorage.getItem("tracking")
      ? true
      : false;
    this._trackingS.trackingStorage = localStorage.getItem("trackingData")
      ? true
      : false;
    this.updating = localStorage.getItem("updating") ? true : false;

    if (localStorage.getItem("fileData")) {
      this._trackingS.fileData = localStorage.getItem("fileData")
        ? JSON.parse(localStorage.getItem("fileData"))
        : null;

      this._updateDataS.watchFileStorage().subscribe((data: any) => {
        this._trackingS.fileData = data;
      });
    } else {
      this._updateDataS.watchFileStorage().subscribe((data: any) => {
        this._trackingS.fileData = data;
      });
    }

    if (localStorage.getItem("tracking")) {
      this.tracking = true;

    } else {
      // Get Storage Subscription
      this._updateDataS.watchTrackingStorage().subscribe((data: any) => {
        this.tracking = true;
      });
    }

    if (localStorage.getItem("trackingData")) {
      this.trackings = localStorage.getItem("trackingData")
        ? JSON.parse(localStorage.getItem("trackingData"))
        : null;
      // Get Storage Subscription
      this._updateDataS.watchTrackStorage().subscribe((data: any) => {
        this.trackings = data;
        this._trackingS.trackingStorage = true;
      });
    } else {
      // Get Storage Subscription
      this._updateDataS.watchTrackStorage().subscribe((data: any) => {
        this.trackings = data;
        this._trackingS.trackingStorage = true;
      });
    }

    if (localStorage.getItem("notes")) {
      this.notesSelect = JSON.parse(localStorage.getItem("notes"));
    }

    this._notesS.notificaNote.subscribe((r) => {
      if (localStorage.getItem("notes")) {
        this.notesSelect = JSON.parse(localStorage.getItem("notes"));

        if (r.notesShow) {
          this._notesS.setNoteSub("notes");
          this._notesS.watchNoteSub().subscribe((data) => {
            console.log(data);
            this.notesSelect = JSON.parse(localStorage.getItem("notes"));
          });
        }
      } else {
        if (r.notesShow) {
          this._notesS.setNoteSub("notes");
          this._notesS.watchNoteSub().subscribe((data) => {
            console.log(data);
            // this.notesSelect.push(data);
            this.notesSelect = JSON.parse(localStorage.getItem("notes"));
          });
        }
      }
    });

    $(document).ready(function () {
      // Tabs Initiation
      // $(".tabs").tabs();

      // Clients Modal Initiation
      // $("#selectUser").modal({
      //   onOpenEnd: function () {
      //     var table = $("#select-users-tbl").DataTable();
      //     table.columns.adjust().draw();
      //   },
      // });

      //  Files Modal Initiation
      //   $("#selectFile").modal({
      //     onOpenEnd: function () {
      //       var table = $("#select-files-tbl").DataTable();
      //       table.columns.adjust().draw();
      //     },
      //   });

      //   $("#modal-File-Upload").modal();
    });
  }

  addComment() {
    const comment = this.form.value.commentProgress;

    this._updateDataS.setItemStorage("comment", comment);
    this._updateDataS.setItemTracking("tracking", true);
  }

  // Change Current Pagination Page
  changeEntry($event) {
    this.selectedEntry = $event;
    this.currentPage = 1;
  }

  changeStatus(status: string) {
    let action = status === "ARCHIVED" ? "archivar" : "reabrir";

    Swal.fire({
      icon: "info",
      title: `¿Seguro que desea ${action} el expediente: ${this._trackingS.fileData.affair}?`,
      text: `Cliente asignado: ${this._trackingS.fileData.assigned_client[0].firstName} ${this._trackingS.fileData.assigned_client[0].lastName}`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        const statusN = {
          status
        }
        this._fileS.updateFile(this._trackingS.fileData._id, statusN).subscribe(resp => {
          if (resp.file.status === "ARCHIVED") {
            this.selected.setValue(0);
          }
          this._updateDataS.setItemFile("fileData", JSON.stringify(resp.file));
        })
      }
    });
  }

  createTracking(file: any) {
    if (
      localStorage.getItem("trackingData") &&
      JSON.parse(localStorage.getItem("trackingData")).file !== file._id
    ) {
      if (localStorage.getItem("tracking")) {
        Swal.fire({
          icon: "warning",
          title: "Seguimiento Activo",
          text: "¿Deseas continuar con el proceso?",
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.value) {
            // this._updateDataS.setItemFile("fileData", JSON.stringify(file));

            this.selected.setValue(2);
          } else {
            this._trackingS
              .deleteTracking(
                JSON.parse(localStorage.getItem("trackingData"))._id
              )
              .subscribe((resp) => {
                if (resp) {
                  this._trackingS.trackingStorage = false;
                  localStorage.removeItem("status");
                  localStorage.removeItem("comment");
                  localStorage.removeItem("trackingData");
                  this._updateDataS.setItemFile("fileData", JSON.stringify(file));
                  this.selected.setValue(2);
                }
              });
          }
        });
      } else if (localStorage.getItem("updating")) {
        Swal.fire({
          icon: "warning",
          title: "Edicion en Proceso",
          text: "¿Deseas continuar con el proceso?",
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.value) {
            // this._updateDataS.setItemFile("fileData", JSON.stringify(file));

            this.selected.setValue(2);
            this.noTrack = JSON.parse(localStorage.getItem("trackingData")).track;
            this.form.patchValue({
              commentProgress: JSON.parse(localStorage.getItem("trackingData"))
                .comment,
            });
          } else {
            this._trackingS
              .updateTracking(
                JSON.parse(localStorage.getItem("trackingData"))._id,
                "SENT"
              )
              .subscribe((resp) => {
                if (resp) {
                  this._trackingS.trackingStorage = false;
                  localStorage.removeItem("comment");
                  localStorage.removeItem("status");
                  localStorage.removeItem("trackingData");
                  localStorage.removeItem("updating");
                  this._updateDataS.setItemFile(
                    "fileData",
                    JSON.stringify(file)
                  );
                  this.selected.setValue(2);
                }
              });
          }
        });
      }
    } else {
      this._updateDataS.setItemFile("fileData", JSON.stringify(file));
      this.selected.setValue(2);
    }
  }

  deleteDoc(id: string) {
    // console.log(id)
    this._trackingS
      .deleteTrackingDoc(JSON.parse(localStorage.getItem("trackingData"))._id, id)
      .subscribe((resp: any) => {
        this._updateDataS.setItemTrack(
          "trackingData",
          JSON.stringify(resp.tracking)
        );
      });
  }

  deleteFile(index: number) {
    this._trackingS.files.splice(index, 1);
  }

  deleteListedNotes(idNote: string) {
    this._notesS.notesSlc = this._notesS.deleteListedNote(idNote);
    this.notesSelect = this._notesS.deleteListedNote(idNote);
    this._notesS.setNoteSub("notes");
  }

  deleteTrack(id: string) {
    console.log(id);
  }

  editTrack(file: any, id: string) {
    console.log(id);
    this._trackingS.getTracking(id).subscribe((res) => {
      console.log(res);
      if (res) {
        this.form.patchValue({
          commentProgress: res.comment
        });
        this.noTrack = res.track;
        this._updateDataS.setItemFile("fileData", JSON.stringify(file));
        this._updateDataS.setItemTrack(
          "trackingData",
          localStorage.getItem("trackingData")
        );
        this.selected.setValue(1);
      }
    });
  }

  filter(value: string) {
    if (value.length >= 1 && value !== '')
      this.filterValue = value;
    else
      this.filterValue = '';
  }

  finish() {
    if (localStorage.getItem("fileData")) {
      if (localStorage.getItem("trackingData")) {
        this._trackingS
          .updateTracking(JSON.parse(localStorage.getItem("trackingData"))._id, 'SENT')
          .subscribe((resp) => {
            console.log(resp);
            this.reset();
          });
      } else {

        this._trackingS
          .createTracking(JSON.parse(localStorage.getItem("fileData"))._id, 'SENT')
          .subscribe((resp) => {
            console.log(resp);
            this.reset();
          });
      }
    }
  }

  getByLowyer() {
    this._trackingS.getByLowyer().subscribe((resp) => {
      console.log(resp);
      this.filesAll = resp;
    });
  }

  private initFileForm() {
    this.form = new FormGroup({
      commentProgress: new FormControl(null, Validators.required),
    });
  }

  open(url) {
    window.open(`http://${url}`, "_blank");
  }

  openDocuments(documents, caseTrack) {
    let evidencesTrack: any[] = documents;
    let evidencesAll: any[] = caseTrack.evidences[0].files;

    let evidences = evidencesAll
      .filter((evA) => {
        return evidencesTrack.some((evT) => {
          return evA._id === evT.file;
        });
      })
      .map((files) => {
        return files.file
      });
    this.bottomSheet.open(DocumentsViewComponent, {
      data: { documents: evidences },
    });
  }

  openSelectEvidences(evidences) {
    let dialogRef = this.dialog.open(SelectEvidenceComponent, { data: {}, autoFocus: false });

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  openSelectNotes(notes) {
    let dialogRef = this.dialog.open(SelectNotesComponent, { data: {}, autoFocus: false }).afterOpened().subscribe(() => {
      this._notesS.setCaseIdSub("select", this.caseTracking._id);
    })

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  reset() {
    if (localStorage.getItem("fileData") && localStorage.getItem("updating")) {
      let noTrack = JSON.parse(localStorage.getItem("trackingData")).track;

      this._notificationsS.message(
        "success",
        `Seguimiento #${noTrack} Actualizado`,
        `Cliente: ${
        JSON.parse(localStorage.getItem("fileData")).assigned_client[0]
          .firstName
        } ${
        JSON.parse(localStorage.getItem("fileData")).assigned_client[0]
          .lastName
        }           Expediente: ${
        JSON.parse(localStorage.getItem("fileData")).affair
        }`,
        false,
        true,
        "Aceptar",
        ""
      );
    } else if (localStorage.getItem("fileData") && localStorage.getItem("tracking")) {
      let noTrack =
        JSON.parse(localStorage.getItem("fileData")).tracks.length === 0
          ? 1
          : JSON.parse(localStorage.getItem("fileData")).tracks.length + 1;

      this._notificationsS.message(
        "success",
        `Seguimiento #${noTrack} Finalizado`,
        `Cliente: ${
        JSON.parse(localStorage.getItem("fileData")).assigned_client[0]
          .firstName
        } ${
        JSON.parse(localStorage.getItem("fileData")).assigned_client[0]
          .lastName
        }           Expediente: ${
        JSON.parse(localStorage.getItem("fileData")).affair
        }`,
        false,
        true,
        "Aceptar",
        ""
      );
    }
    this.getByLowyer();
    this.selected.setValue(0);
    this._trackingS.reset();
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  // View Case Tracking List
  viewCaseTrackingList(file: any) {
    this.caseTracking = file;
    this.selected.setValue(1);
  }
}
