import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PracticeArea } from "../../models/PracticeArea";
import { Router } from "@angular/router";
import { PracticeAreasService } from "../../services/practice-areas.service";
import { UtilitiesService } from "../../services/utilities.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {
  constructor(
    public _practiceAreaS: PracticeAreasService,
    private _utilitiesS: UtilitiesService,
    private router: Router
  ) {}

  subscriptionsArray: Subscription[] = [];

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

  // Go to Area Detail Section
  goToAreaDetail(id: string): void {
    this._practiceAreaS.goToAreaDetail(this.router, id, this.practiceAreasList);
  }

  // Scroll to Top Function
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
