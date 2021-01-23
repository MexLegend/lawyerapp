import { Component, OnInit, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { EvidencesService } from "src/app/services/evidences.service";
import { TrackingService } from "src/app/services/tracking.service";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-documents-view",
  templateUrl: "./documents-view.component.html",
  styleUrls: ["./documents-view.component.css"],
})
export class DocumentsViewComponent implements OnInit {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public _evidencesS: EvidencesService,
    public _trackingS: TrackingService,
    public _usersS: UsersService
  ) {}

  evidences: any;

  ngOnInit() {
    if (this.data !== null) {
      this.evidences = this.data.evidences;
    }
  }

  isEvidenceVisible(extension: string): boolean {
    let isVisible = false;
    extension.includes("doc") ? (isVisible = false) : (isVisible = true);
    return isVisible;
  }

  open(url) {
    if (url.indexOf("pdf") >= 0) {
      if (this._usersS.user.role === "ADMIN") {
        window.open(`http://${url}`);
      } else {
        this._evidencesS.downloadEvidence(url, "PDF");
      }
    } else {
      window.open(`http://${url}`);
    }
  }
}
