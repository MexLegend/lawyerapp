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

  quoteForm: FormGroup;
  quoteModalAction: string;
  quoteModalType: string;
  quoteTypesList: Array<string> = [
    "Sitio Web",
    "Libro",
    "Caso",
    "Artículo de Revista",
    "Artículo de Periódico",
    "Patente",
  ];
  renderedInputs: number = 0;

  ngOnInit() {
    this.initQuoteForm();

    if (this.data) {
      this.quoteModalAction = this.data.action;
      this.quoteModalType = this.data.type;

      // Set Input Values If The Quote Is Updating
      if (this.data.quoteData && this.data.quoteData !== "") {
        const { ...quoteData } = this.data.quoteData;
        this.quoteForm.patchValue(quoteData);
        this.displayInputs(quoteData.quoteType);
      } else {
        this.quoteForm.reset();
        this.quoteForm.controls["quoteType"].setValue("Sitio Web");
        this.displayInputs("Sitio Web");
      }
    }
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Init Quote Form
  private initQuoteForm() {
    this.quoteForm = new FormGroup({
      quoteType: new FormControl("Sitio Web"),
      quoteAuthor: new FormControl(null),
      quotePageName: new FormControl(null),
      quoteWebSiteName: new FormControl(null),
      quoteYear: new FormControl(null),
      quoteMonth: new FormControl(null),
      quoteDay: new FormControl(null),
      quoteUrl: new FormControl(null),
      quoteTitle: new FormControl(null),
      quoteCity: new FormControl(null),
      quotePublisher: new FormControl(null),
      quoteCaseNumber: new FormControl(null),
      quoteCourt: new FormControl(null),
      quotePages: new FormControl(null),
      quotePeriodicalTitle: new FormControl(null),
      quoteJournalName: new FormControl(null),
      quoteInventor: new FormControl(null),
      quoteCountry: new FormControl(null),
      quotePatentNumber: new FormControl(null),
      _id: new FormControl(null),
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  createOrUpdateQuote() {
    const { _id: _id, ...quoteData } = this.quoteForm.value;

    // Filter Not Null Values
    Object.keys(quoteData).forEach(
      (key) => quoteData[key] == null && delete quoteData[key]
    );

    // Update Quote Data
    if (this.quoteForm.value._id !== null) {
      this._practiceAreaS.setQuotesList([{ _id, ...quoteData }], "update");
      this.closeModal();

      // Create New Quote
    } else {
      this._practiceAreaS.setQuotesList(
        [{ _id: this._utilitiesS.generateRandomPass(), ...quoteData }],
        "push"
      );
      this.closeModal();
    }
  }

  // Render Specific Inputs According To Selected Option
  displayInputs(selectValue: any) {
    let activeInputValidators: Array<string> = [];
    let activeInputs: any = null;

    switch (selectValue) {
      case "Sitio Web":
        activeInputValidators = ["quoteUrl"];
        activeInputs = 0;
        break;
      case "Libro":
        activeInputValidators = ["quoteAuthor", "quoteTitle"];
        activeInputs = 1;
        break;
      case "Caso":
        activeInputValidators = ["quoteTitle"];
        activeInputs = 2;
        break;
      case "Artículo de Revista":
        activeInputValidators = ["quoteJournalName"];
        activeInputs = 3;
        break;
      case "Artículo de Periódico":
        activeInputValidators = ["quotePeriodicalTitle"];
        activeInputs = 4;
        break;
      default:
        activeInputValidators = ["quoteInventor"];
        activeInputs = 5;
        break;
    }

    this.setValidators(activeInputValidators);
    this.renderedInputs = activeInputs;
  }

  // Reset Inputs According To Selected Option
  resetInputs(selectValue: any) {
    this.quoteForm.reset();
    if (this.data.quoteData)
      this.quoteForm.controls["_id"].setValue(this.data.quoteData._id);
    this.quoteForm.controls["quoteType"].setValue(selectValue);
  }

  // Set Required Validators According To Selected Option
  setValidators(validatorsRequired: Array<string>) {
    validatorsRequired.map((validatorRequired) => {
      for (const control in this.quoteForm.controls) {
        if (control === validatorRequired) {
          this.quoteForm
            .get(validatorRequired)
            .setValidators(Validators.required);
          this.quoteForm.get(validatorRequired).updateValueAndValidity();
        } else {
          this.quoteForm.get(control).clearValidators();
          this.quoteForm.get(control).updateValueAndValidity();
        }
      }
    });
  }
}
