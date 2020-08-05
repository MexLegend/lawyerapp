import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: "app-write-note",
  templateUrl: "./write-note.component.html",
  styleUrls: ["./write-note.component.css"],
})
export class WriteNoteComponent implements OnInit {
  constructor(
    public _notesS: NotesService
  ) {}

  form: FormGroup;
  public config: PerfectScrollbarConfigInterface = {};
  statusList = [
    { value: "private", viewValue: "Privada" },
    { value: "public", viewValue: "Publica" }
  ];
  selectedStatus = this.statusList[0].value;

  ngOnInit() {
    this.initNotesForm();
  }

  private initNotesForm() {
    this.form = new FormGroup({
      noteAffair: new FormControl(null, Validators.required),
      noteMessage: new FormControl(null, Validators.required),
      noteStatus: new FormControl(this.selectedStatus, Validators.required),
    });
  }

  new() {
    console.log(this.form.value)
    this._notesS.createNote(this.form.value)
      .subscribe(r => {
        console.log(r)
      })
  }
}
