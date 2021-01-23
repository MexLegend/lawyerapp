import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { NotesService } from "../../services/notes.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Subscription } from "rxjs";

@Component({
  selector: "app-write-note",
  templateUrl: "./write-note.component.html",
  styleUrls: ["./write-note.component.css"],
})
export class WriteNoteComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WriteNoteComponent>,
    public _notesS: NotesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  public config: PerfectScrollbarConfigInterface = {};
  currentCaseId: string;
  form: FormGroup;
  noteModalTitle: any;
  statusList = [
    { value: "PRIVATE", viewValue: "Privada" },
    { value: "PUBLIC", viewValue: "Publica" },
  ];

  ngOnInit() {
    this.initNotesForm();

    if (this.data) {
      this.noteModalTitle = this.data.action;

      // Set Input Values If The Note Is Updating 
      if (
        this.data.idNote &&
        this.data.idNote !== "" &&
        this._notesS.noteSelected !== null
      ) {
        const { affair, message, status, _id } = this._notesS.noteSelected;
        this.form.patchValue({
          noteAffair: affair,
          noteMessage: message,
          noteStatus: status,
          _id,
        });
      } else {
        this.form.patchValue({
          noteStatus: "PUBLIC",
        });
      }
    }
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Init Notes Form
  private initNotesForm() {
    this.form = new FormGroup({
      noteAffair: new FormControl(null, Validators.required),
      noteMessage: new FormControl(null, Validators.required),
      noteStatus: new FormControl(null, Validators.required),
      _id: new FormControl(null),
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  // Write / Update Note
  new() {
    if (this.noteModalTitle === "Crear") {
      this.subscriptionsArray.push(
        this._notesS
          .createNote(
            JSON.parse(localStorage.getItem("caseData"))._id,
            this.form.value
          )
          .subscribe((returnedNote) => {
            this._notesS.setListedNotesSub("list", returnedNote.note.notes);
            this.closeModal();
          })
      );
    } else {
      this.subscriptionsArray.push(
        this._notesS
          .updateNote(
            JSON.parse(localStorage.getItem("caseData"))._id,
            this.form.value
          )
          .subscribe((returnedNote) => {
            this._notesS.setListedNotesSub("list", returnedNote.note.notes);
            this._notesS.noteSelected = null;
            this.closeModal();
          })
      );
    }
  }
}
