import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NotesService } from '../../services/notes.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

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

  public config: PerfectScrollbarConfigInterface = {};
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
      console.log(this.data);

      if (
        this.data.idNote &&
        this.data.idNote !== "" &&
        this._notesS.noteSelected !== null
      ) {
        console.log(this._notesS.noteSelected);
        const { affair, message, status, _id } = this._notesS.noteSelected;
        this.form.patchValue({
          noteAffair: affair,
          noteMessage: message,
          noteStatus: status,
          _id,
        });
      } else {
        // this.form.get("noteStatus").setValue("PUBLIC");
        this.form.patchValue({
          noteStatus: "PUBLIC",
        });
      }
    }
  }

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

  new() {
    if (this.noteModalTitle === "Crear") {
      this._notesS.createNote(this.form.value).subscribe((r) => {
        this._notesS.notificaNote.emit({ render: true });
        this._notesS.setCaseIdSub("new", this._notesS.caseId);
        this.closeModal();
      });
    } else {
      this._notesS
        .updateNote(this._notesS.caseId, this.form.value)
        .subscribe((r) => {
          this._notesS.notificaNote.emit({ render: true });
          this._notesS.setCaseIdSub("new", this._notesS.caseId);
          this._notesS.noteSelected = null;
          this.closeModal();
        });
    }
  }
}
