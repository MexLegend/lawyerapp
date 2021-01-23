import { Component, OnInit, Inject } from "@angular/core";
import { EvidencesService } from "../../services/evidences.service";
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";

@Component({
  selector: "app-select-evidence",
  templateUrl: "./select-evidence.component.html",
  styleUrls: ["./select-evidence.component.css"],
})
export class SelectEvidenceComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _evidencesS: EvidencesService,
    public dialogRef: MatDialogRef<SelectEvidenceComponent>
  ) {}

  subscriptionsArray: Subscription[] = [];

  modalCurrentCase: any;
  modalCurrentTracking: any;
  modalViewType: string;

  ngOnInit() {
    this.subscriptionsArray.push(
      this._evidencesS.emitEvidence.subscribe((data) => {
        if (data.closeModal) {
          this.closeModal();
        }
      })
    );

    if (this.data.viewDetails) {
      this.modalCurrentCase = this.data.caseData;
      this.modalCurrentTracking = this.data.trackingData;
      this.modalViewType = this.data.viewDetails;
    } else {
      this.modalViewType = null;
    }
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  closeModal() {
    this.dialogRef.close();
  }
}
