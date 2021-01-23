import { Component, OnInit, Input } from "@angular/core";
import { PostAnalytics } from "../../../models/PostAnalytics";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.css"],
})
export class CommentsComponent implements OnInit {
  constructor() {}

  @Input() comments: PostAnalytics;

  ngOnInit() {
    console.log(this.comments);
  }
}
