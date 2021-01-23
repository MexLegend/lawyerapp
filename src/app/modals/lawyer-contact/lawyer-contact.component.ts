import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

@Component({
  selector: "app-lawyer-contact",
  templateUrl: "./lawyer-contact.component.html",
  styleUrls: ["./lawyer-contact.component.css"],
})
export class LawyerContactComponent implements OnInit {
  panelOpenState = false;

  constructor(public dialogRef: MatDialogRef<LawyerContactComponent>) {}

  public config: PerfectScrollbarConfigInterface = {};

  ngOnInit() {}

  closeModal() {
    this.dialogRef.close();
  }
}
