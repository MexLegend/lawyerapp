import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Subscription } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PracticeAreasService } from "../../services/practice-areas.service";
import { UtilitiesService } from "../../services/utilities.service";

@Component({
  selector: "app-references",
  templateUrl: "./references.component.html",
  styleUrls: ["./references.component.css"],
})
export class ReferencesComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReferencesComponent>,
    private _practiceAreaS: PracticeAreasService,
    private _utilitiesS: UtilitiesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  referenceForm: FormGroup;
  referenceModalAction: string;
  referenceModalType: string;

  ngOnInit() {
    this.initReferenceForm();

    if (this.data) {
      this.referenceModalAction = this.data.action;
      this.referenceModalType = this.data.type;

      // Set Input Values If The Reference Is Updating
      if (this.data.referenceData && this.data.referenceData !== "") {
        const { reference, _id } = this.data.referenceData;
        this.referenceForm.patchValue({
          reference: reference,
          _id,
        });
      } else {
        this.referenceForm.reset();
      }
    }
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Init Reference Form
  private initReferenceForm() {
    this.referenceForm = new FormGroup({
      reference: new FormControl(null, Validators.required),
      _id: new FormControl(null),
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  createOrUpdateReference() {
    const { _id: id, ...referenceData } = this.referenceForm.value;

    // Update Reference Data
    if (this.referenceForm.value._id !== null) {
      this._practiceAreaS.setReferencesList(
        [this.referenceForm.value],
        "update"
      );
      this.closeModal();

      // Create New Reference
    } else {
      this._practiceAreaS.setReferencesList(
        [{ _id: this._utilitiesS.generateRandomPass(), ...referenceData }],
        "push"
      );

      this.closeModal();
    }
  }
}
