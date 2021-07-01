import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UtilitiesService } from "../../services/utilities.service";
import { UsersService } from "../../services/users.service";
import { Subscription } from "rxjs";
import { RatingService } from "../../services/rating.service";
import { MatDialogRef } from "@angular/material";
import { NgxStarsComponent } from "ngx-stars";

@Component({
  selector: "app-rate",
  templateUrl: "./rate.component.html",
  styleUrls: ["./rate.component.css"],
})
export class RateComponent implements OnInit {
  @ViewChild("previewRatingStars", { static: false })
  starsComponent: NgxStarsComponent;

  subscriptionsArray: Subscription[] = [];

  action: string;
  dataType: string;
  dataList: any[];
  isFormValid: boolean;
  isEditing: boolean;
  inputData: any;
  rateForm: FormGroup;
  selectedTab = new FormControl(0);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RateComponent>,
    private _ratingS: RatingService,
    public _utilitiesS: UtilitiesService,
    public _usersS: UsersService
  ) {}

  ngOnInit(): void {
    this.initRateForm();
    this.isFormValid = false;
    this.isEditing = false;

    // Get Current Rating Data
    this.subscriptionsArray.push(
      this._ratingS.getRatingData().subscribe((ratingData) => {
        this.rateForm.patchValue({
          rate: ratingData.rating,
          rateComment: ratingData.comment.comment,
        });
        this.isFormValid = true;
      })
    );

    if (this.data) {
      this.inputData = this.data.inputData;
      this.dataList = this.data.dataList;
      this.action = this.data.action;
      this.dataType = this.data.dataType;
      if (this.data.action === "update") {
        this._ratingS.setRatingData(this.inputData.ratingData);
        this.isEditing = true;
        this.selectedTab.setValue(1);
      }
    }
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  initRateForm() {
    this.rateForm = new FormGroup({
      rate: new FormControl(null, [Validators.required, Validators.min(1)]),
      rateComment: new FormControl(null),
    });
  }

  onRatingSet(rating: number): void {
    this.rateForm.controls["rate"].setValue(rating);
    this.starsComponent.setRating(rating);
    if (rating >= 1) this.isFormValid = true;
    else this.isFormValid = false;
  }

  rate() {
    // Rate Data
    if (this.action === "create")
      this._ratingS
        .rateData(
          {
            ...this.rateForm.value,
            id: this.inputData._id,
            user_id: this._usersS.user._id,
            dataType: this.dataType,
          },
          this._usersS.token
        )
        .subscribe((resp) => {
          this._ratingS.setRatingData(resp.rateResponse);
          this._usersS.reloadUserData(resp.user);
          this._ratingS.reloadRatingData(this.dataList, this.dataType);
        });
    // Update Rated Data
    else
      this._ratingS
        .updateRatedData(
          {
            ...this.rateForm.value,
            id: this.inputData.ratingData?._id,
          },
          this._usersS.token
        )
        .subscribe((resp) => {
          this._ratingS.setRatingData(resp.rateResponse);
          this._usersS.reloadUserData(
            this.updateNestedObjectValue(this._usersS.user, resp.rateResponse)
          );
          this._ratingS.reloadRatingData(this.dataList, this.dataType);
        });
    this.dialogRef.close();
  }

  updateNestedObjectValue(entryData: any, newItem: any) {
    const entryDataArray = entryData;

    const i = entryData.ratings.findIndex(
      (dataItem) => dataItem._id === newItem._id
    );

    entryDataArray.ratings[i] = newItem;

    return entryDataArray;
  }
}
