import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Subscription } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PracticeAreasService } from "../../services/practice-areas.service";
import { UtilitiesService } from "../../services/utilities.service";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.css"],
})
export class FAQComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FAQComponent>,
    private _practiceAreaS: PracticeAreasService,
    private _utilitiesS: UtilitiesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  faqForm: FormGroup;
  faqModalAction: string;

  ngOnInit() {
    this.initFaqForm();

    if (this.data) {
      this.faqModalAction = this.data.action;

      // Set Input Values If The FAQ Is Updating
      if (this.data.faqData && this.data.faqData !== "") {
        const { question, answer, _id } = this.data.faqData;
        this.faqForm.patchValue({
          question: question,
          answer: answer,
          _id,
        });
      } else {
        this.faqForm.reset();
      }
    }
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Init FAQ Form
  private initFaqForm() {
    this.faqForm = new FormGroup({
      question: new FormControl(null, Validators.required),
      answer: new FormControl(null, Validators.required),
      _id: new FormControl(null),
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  createOrUpdateFAQ() {
    const { _id: id, ...faqData } = this.faqForm.value;

    // Update Practice Area Data
    if (this.faqForm.value._id !== null) {
      this._practiceAreaS.setFAQsList([this.faqForm.value], "update");
      this.closeModal();

      // Create New Practice Area
    } else {
      this._practiceAreaS.setFAQsList(
        [{ _id: this._utilitiesS.generateRandomPass(), ...faqData }],
        "push"
      );

      this.closeModal();
    }
  }
}
