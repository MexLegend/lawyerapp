import { Component, OnInit, HostListener, Input } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';

import { Files } from '../../models/Files';
import { WriteNoteComponent } from '../../modals/write-note/write-note.component';

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FiltersComponent } from 'src/app/modals/filters/filters.component';
import { NotesService } from '../../services/notes.service';

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
  @Input() notes: any;

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
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;
    console.log(this.modeV);
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
  openFilters(filters) {
    let dialogRef = this.dialog.open(FiltersComponent, {
      data: {},
      autoFocus: false,
    });

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  // Open Note Creation Modal
  openNotes(notes) {
    let dialogRef = this.dialog.open(WriteNoteComponent, {
      data: {},
      autoFocus: false,
    });

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  // View Files List Function
  viewFilesList(data: any) {
    this.fileData = data;
  }
}