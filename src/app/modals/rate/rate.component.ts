import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "../../models/User";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-rate",
  templateUrl: "./rate.component.html",
  styleUrls: ["./rate.component.css"],
})
export class RateComponent implements OnInit {
  actionType: string;
  isFormValid: boolean = false;
  lawyer: User;
  rateForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.initRateForm();

    if (this.data) {
      this.lawyer = this.data.user;
      this.actionType = this.data.actionType;
    }
  }

  initRateForm() {
    this.rateForm = new FormGroup({
      rate: new FormControl(null, [Validators.required, Validators.min(1)]),
      rateComment: new FormControl(null),
    });
  }

  onRatingSet(rating: number): void {
    this.rateForm.controls["rate"].setValue(rating);
    if (rating >= 1) this.isFormValid = true;
    else this.isFormValid = false;
  }

  rate() {
    console.log(this.rateForm.value);
  }
}
