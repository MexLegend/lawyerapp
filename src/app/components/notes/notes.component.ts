import { Component, OnInit, HostListener, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import Swal from "sweetalert2";

import { WriteNoteComponent } from "../../modals/write-note/write-note.component";

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FiltersComponent } from "src/app/modals/filters/filters.component";
import { NotesService } from "../../services/notes.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { TrackingService } from "src/app/services/tracking.service";
import { CasesService } from "../../services/cases.service";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.css"],
})
export class NotesComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private _casesS: CasesService,
    public _localStorageS: LocalStorageService,
    public _notesS: NotesService,
    public _trackingS: TrackingService
  ) {}

  @Input() modeV: string;
  @Input() idCase: string;

  public config: PerfectScrollbarConfigInterface = {};
  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;

  currentPage: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  existS: number;
  fileData: any;
  filterValue: string;
  isCaseArchived: boolean = false;
  notes: any = [];
  notesStorage: any;

  selected = new FormControl(0);
  selectedEntry: number = 10;
  statusNote: any;

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

    // Validate If Evidences Case Is Archived
    this._casesS.getIsCaseArchived().subscribe((isArchived) => {
      this.isCaseArchived = isArchived;
    });

    // Get Notes Data Subscription
    this._notesS.getListedNotesSub().subscribe((data) => {
      this.returnNotDeletedNotes(data.action, data.data).then((notesArray) => {
        if (data.action === "create") {
          this.notes = [];
          this.loadNotes(data.data);
        } else if (data.action === "list") {
          this.notes = notesArray;
        } else {
          this.notes = [];
          this.notes = notesArray;
        }
      });
    });

    // Load Current Checked Notes
    this._notesS.getCurrentCheckedNotes();
  }

  addNotes() {
    this._notesS.setShowingListedNotes();
    this._notesS.notificaNote.emit({ closeModal: true });
  }

  // Add checked notes to array
  addCheckedNotes($event, note) {
    if ($event.checked) {
      this._notesS.setCheckNotes(note, "check");
    } else {
      this._notesS.setCheckNotes(note, "uncheck");
    }
  }

  deleteNote(idNote: string, statusN: string) {
    Swal.fire({
      icon: "warning",
      title: "¿Esta seguro?",
      text: "Esta a punto de borrar la nota",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this._notesS
          .changeStatusNote(this._notesS.caseId, idNote, statusN)
          .subscribe(() => {
            this._notesS.notificaNote.emit({ render: true });
          });
      }
    });
  }

  deleteListedNote(idNote: string) {
    return this._notesS.deleteListedNote(idNote);
  }

  editNote(note: any) {
    this._notesS.noteSelected = note;
  }

  // Change Current Pagination Page
  changeEntry($event) {
    this.selectedEntry = $event;
    this.currentPage = 1;
  }

  // Change Current Pagination Page
  change(value) {
    this.statusNote = `status.${value}`;
  }

  changeStatus(idNote: string, statusN: string) {
    this._notesS
      .changeStatusNote(
        JSON.parse(localStorage.getItem("caseData"))._id,
        idNote,
        statusN
      )
      .subscribe((returnedNote) => {
        this._notesS.notificaNote.emit({ render: true });
        this._notesS.setListedNotesSub("delete", returnedNote.notes);
      });
  }

  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  // Compare Local Storage Checked Notes With Existing Ones
  isNoteChecked(idNote: any): boolean {
    let isChecked: boolean;

    isChecked =
      this._notesS.getShowingCheckedNotes().length >= 1
        ? this._notesS
            .getShowingCheckedNotes()
            .some((note: any) => note._id === idNote)
        : false;

    return isChecked;
  }

  loadNotes(caseId: string) {
    // this._notesS.caseId = caseId;
    this._notesS.getNotes(caseId).subscribe((resp) => {
      if (resp.docs.length >= 1 && resp.docs[0].notes.length >= 1) {
        resp.docs[0].notes.filter((note) => {
          if (this.modeV === "new" && note.status !== "DELETED") {
            this.notes.push(note);
          } else if (this.modeV === "select" && note.status === "PUBLIC") {
            this._localStorageS.addLocalStorageItem("noteId", resp.docs[0]._id);
            this.notes.push(note);
          }
        });
      } else {
        this.notes = [];
      }
    });
  }

  loadStorage() {
    if (this.notesStorage) {
      let existA: number;
      this.notes.forEach((note) => {
        this.existS = JSON.parse(this.notesStorage).filter((noteS) => {
          return noteS._id === note._id;
        });
      });
    }
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

  // Open Note Creation Modal
  openFilters(filters?: any) {
    let dialogRef = this.dialog.open(FiltersComponent, {
      data: {},
      autoFocus: false,
    });
  }

  // Open Note Creation Modal
  openNotes(idNote?: any) {
    let dialogRef =
      idNote && idNote !== ""
        ? this.dialog.open(WriteNoteComponent, {
            data: { idNote, action: "Actualizar" },
            autoFocus: false,
          })
        : this.dialog.open(WriteNoteComponent, {
            data: { action: "Crear" },
            autoFocus: false,
          });
  }

  return() {
    this._trackingS.setActiveCaseTabSub(0);
  }

  async returnNotDeletedNotes(action: string, notesArray: any): Promise<any> {
    let obtainedNotes: any[] = [];
    action !== "create"
      ? notesArray.map((note) => {
          note.status !== "DELETED"
            ? (obtainedNotes = [...obtainedNotes, note])
            : null;
        })
      : null;

    return new Promise((resolve, reject) => resolve(obtainedNotes));
  }

  // View Files List Function
  viewFilesList(data: any) {
    this.fileData = data;
  }
}
