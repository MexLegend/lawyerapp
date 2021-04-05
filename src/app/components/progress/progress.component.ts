import { Component, OnInit, Input } from "@angular/core";
import { CloudinaryService } from "../../services/cloudinary.service";

@Component({
  selector: "app-progress",
  templateUrl: "./progress.component.html",
  styleUrls: ["./progress.component.scss"],
})
export class ProgressComponent implements OnInit {
  constructor(private _cloudinaryS: CloudinaryService) {}

  @Input() progress: number = 0;
  @Input() percentage: number = 0;

  ngOnInit() {}
}
