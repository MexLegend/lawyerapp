import { Component, OnInit, HostListener, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import Swal from "sweetalert2";

import { Files } from "../../models/Files";
import { WriteNoteComponent } from "../../modals/write-note/write-note.component";

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FiltersComponent } from "src/app/modals/filters/filters.component";
import { NotesService } from "../../services/notes.service";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.css"],
})
export class NotesComponent implements OnInit {
  constructor(public dialog: MatDialog, public _notesS: NotesService) {}

  files: Files[] = [];
  fileData: any;
  @Input() modeV: string;
  @Input() idCase: string;
  notes: any = [];

  notesTemp: any[] = [];

  existS: number;
  notesStorage: any;

  filterValue: string;
  selectedEntry: number = 5;
  currentPage: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  statusNote: any;

  selected = new FormControl(0);
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
    console.log(this.notesStorage);

    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    this._notesS.getCaseIdSub().subscribe(({ caseId }) => {
      this.notes = [];
      this.loadNotes(caseId);
    });
  }

  addNotes() {
   
    let existS: number;

    // return;
    if (this.notesTemp.length >= 1) {
      if (localStorage.getItem("notes")) {
    console.log(this.notesTemp)
        this.notesTemp.map(note => {

          existS = JSON.parse(localStorage.getItem("notes")).findIndex((noteS) => {
            return noteS._id === note._id;
          });
          if (existS === -1) {
            if (JSON.parse(localStorage.getItem("notes")).length >= 1) {
              this._notesS.notesSlc = [
                ...JSON.parse(localStorage.getItem("notes")),
                note,
              ];
            }
            this._notesS.setNoteSub("notes", note);
             this._notesS.notificaNote.emit({ notesShow: true });
             this.notesTemp = [];
          }
        })
      } else {
        console.log('NO STORAGE NOTES: ',this.notesTemp)
        this.notesTemp.map(note => {

        this._notesS.notesSlc.push(note);
        this._notesS.setNoteSub("notes", note);
         this._notesS.notificaNote.emit({ notesShow: true });
         this.notesTemp = [];
        })
      }
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
    console.log(value);
    this.statusNote = `status.${value}`;
  }

  changeStatus(idNote: string, statusN: string) {
    this._notesS
      .changeStatusNote(this._notesS.caseId, idNote, statusN)
      .subscribe(() => {
        if(localStorage.getItem('notes') && statusN === 'PUBLIC') {
          this._notesS.notesSlc = this._notesS.deleteListedNote(idNote);
          this._notesS.setNoteSub("notes");
        }
        this._notesS.notificaNote.emit({ render: true });
        this._notesS.setCaseIdSub("new", this._notesS.caseId);
      });
  }

  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  loadNotes(caseId: string) {
    console.log(caseId);
    this._notesS.caseId = caseId;
    this._notesS.getNotes(caseId).subscribe((resp) => {
      console.log(resp);
      if (resp.docs.length >= 1 && resp.docs[0].notes.length >= 1) {
        resp.docs[0].notes.filter((note) => {
          if (this.modeV === "new" && note.status !== "DELETED") {
            this.notes.push(note);
          } else if (this.modeV === "select" && note.status === "PUBLIC") {
            this.notes.push(note);
          }
        });
      } else {
        this.notes = [];
        console.log("no se puede");
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

      // if (existS === -1) {
      //   this._notesS.notesSlc.push(note);
      // }
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

  // Compare Local Storage Checked Notes With Existing Ones
  isNoteChecked(idNote: any): boolean {
    let isChecked: boolean;
    if (
      localStorage.getItem("notes") &&
      JSON.parse(localStorage.getItem("notes")).length >= 1
    ) {
      this.notesStorage = JSON.parse(localStorage.getItem("notes"));
      isChecked =
        localStorage.getItem("notes") &&
        JSON.parse(localStorage.getItem("notes")).length >= 1
          ? this.notesStorage.some((note: any) => note._id === idNote)
          : false;
    }

    return isChecked;
  }

  // Open Note Creation Modal
  openFilters(filters) {
    let dialogRef = this.dialog.open(FiltersComponent, {
      data: {},
      autoFocus: false,
    });

    // dialogRef.afterClosed().subscribe(result => {
    // });
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

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  return() {
    this._notesS.notificaNote.emit({ tab: true });
  }

  slc($event, note) {
    if ($event.checked) {
      this.notesTemp.push(note)
      
    } else {
      this.notesTemp.filter(noteT => {
        return noteT._id !== note._id
      })
      // if (localStorage.getItem("notes")) {
      //   this._notesS.notesSlc = this.deleteListedNote(note._id);
      //   this._notesS.setNoteSub("notes", note);
      // }
    }
  }

  // View Files List Function
  viewFilesList(data: any) {
    this.fileData = data;
  }
}
