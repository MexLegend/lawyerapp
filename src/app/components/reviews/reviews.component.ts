import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.css"],
})
export class ReviewsComponent implements OnInit {
  @Input() filterType: string = null;
  @Input() reviewData: any = null;
  @Input() showBg: string = null;
  @Input() showTitle: string = null;

  comments: any = null;
  filterVariable: string = "-date";
  filterReviewsForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.initFilterReviewsForm();
  }

  private async initFilterReviewsForm() {
    this.filterReviewsForm = new FormGroup({
      filterValue: new FormControl(null, Validators.required),
    });
  }

  filterReviews(selection?: any) {
    selection
      ? console.log(selection.value)
      : console.log(this.filterReviewsForm.value.filterValue);
  }
}
