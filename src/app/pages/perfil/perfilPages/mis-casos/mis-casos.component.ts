import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs/internal/Subject";

import { Cases } from "../../../../models/Cases";
import { CasesService } from "../../../../services/cases.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { TrackingService } from "src/app/services/tracking.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { Subscription } from "rxjs";

declare var $: any;

@Component({
  selector: "app-mis-casos",
  templateUrl: "./mis-casos.component.html",
  styleUrls: ["./mis-casos.component.css"],
})
export class MisCasosComponent implements OnInit {
  constructor(
    private router: Router,
    public _casesS: CasesService,
    public _localStorageS: LocalStorageService
  ) {}

  subscriptionsArray: Subscription[] = [];

  // Pagination Variables
  currentPage: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  cases: Cases[] = [];
  filterValue: string;
  selectedEntry: number = 10;

  public config: PerfectScrollbarConfigInterface = {};
  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerScreenWidth = window.innerWidth;
    if (this.innerScreenWidth > 520) {
      this.mobileFilterActivated = false;
    }
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    // Get Cases Supcription
    this.subscriptionsArray.push(this._casesS.getCases().subscribe());

    // List Cases Subscription
    this.subscriptionsArray.push(
      this._casesS.getCasesData().subscribe((cases) => {
        this.cases = cases.docs;
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Change Current Pagination Page
  changeEntry($event) {
    this.selectedEntry = $event;
    this.currentPage = 1;
  }

  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  // Navigate To Case Datail
  goToFile(idCase: any, idClient: any) {
    const url = `/perfil/caso-detalle/${idCase}-${idClient}`;
    this.router.navigateByUrl(url);
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  setCurrentCaseData(currentCase: any) {
    this._localStorageS.addLocalStorageItem("trackingCaseData", currentCase);
  }
}
