import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { NotesService } from "../../services/notes.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-select-notes",
  templateUrl: "./select-notes.component.html",
  styleUrls: ["./select-notes.component.css"],
})
export class SelectNotesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SelectNotesComponent>,
    public _notesS: NotesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  notes: any;

  ngOnInit() {
    this.subscriptionsArray.push(
      this._notesS.notificaNote.subscribe((data) => {
        if (data.closeModal) {
          this.closeModal();
        }
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  closeModal() {
    this.dialogRef.close();
  }
}
