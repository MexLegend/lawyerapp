import { Component, OnInit } from "@angular/core";
import { PracticeArea } from "../../models/PracticeArea";
import { PracticeAreasService } from "../../services/practice-areas.service";
import { Subscription } from "rxjs";
import { UtilitiesService } from "../../services/utilities.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-practice-areas",
  templateUrl: "./practice-areas.component.html",
  styleUrls: ["./practice-areas.component.css"],
})
export class PracticeAreasComponent implements OnInit {
  constructor(
    public _practiceAreaS: PracticeAreasService,
    private router: Router,
    public _utilitiesS: UtilitiesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  filterValue: string;
  practiceAreasList: Array<PracticeArea> = [];

  ngOnInit() {
    // Get Practice Areas Supcription
    this.subscriptionsArray.push(
      this._practiceAreaS.getPracticeAreas("APPROVED").subscribe()
    );

    // List Practice Areas Subscription
    this.subscriptionsArray.push(
      this._practiceAreaS
        .getPracticeAreasList()
        .subscribe(([practiceAreasList, action]) => {
          practiceAreasList.map(
            (practiceArea) =>
              (this.practiceAreasList = this._utilitiesS.upsertArrayItems(
                this.practiceAreasList,
                practiceArea,
                action
              ))
          );
        })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  // Go to Area Detail Section
  goToAreaDetail(id: string): void {
    this._practiceAreaS.goToAreaDetail(this.router, id, this.practiceAreasList);
  }
}
