import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.css"],
})
export class ReviewsComponent implements OnInit {
  @Input() filterType: string = null;
  @Input() showBg: string = null;
  @Input() showTitle: string = null;

  comments: any = null;
  filterVariable: string = "-date";

  constructor() {}

  ngOnInit(): void {}
}
