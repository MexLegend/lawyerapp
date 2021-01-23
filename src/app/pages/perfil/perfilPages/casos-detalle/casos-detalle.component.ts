import { Component, OnInit, HostListener } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";

import { CasesService } from "../../../../services/cases.service";
import { TrackingService } from "../../../../services/tracking.service";
import { Tracking } from "../../../../models/Tracking";
import { DocumentsViewComponent } from "../../../../modals/documents-view/documents-view.component";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { UtilitiesService } from "src/app/services/utilities.service";
import { Cases } from "../../../../models/Cases";
import { SelectEvidenceComponent } from "src/app/modals/select-evidence/select-evidence.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-casos-detalle",
  templateUrl: "./casos-detalle.component.html",
  styleUrls: ["./casos-detalle.component.css"],
})
export class CasosDetalleComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    public _casesS: CasesService,
    public _trackingS: TrackingService,
    public _utilitiesS: UtilitiesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  currentPage: number = 1;
  caseData: any = [];
  currentCaseData: any;
  showMoreIndex: number = null;
  trackings: Tracking[] = [];
  tracksList: any;

  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

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

    this.subscriptionsArray.push(
      this.activatedRoute.params.subscribe((params) => {
        const id = params["id"];
        if (id !== "new") {
          this.load(id.split("-")[0], id.split("-")[1]);
        }
      })
    );

    // Get Active Read More Index Subscription
    this.subscriptionsArray.push(
      this._utilitiesS.getClientShowMoreIndexSub().subscribe((index) => {
        this.showMoreIndex = index;
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  load(idCase: string, idClient: string) {
    this.subscriptionsArray.push(
      this._trackingS.getByClient(idCase, idClient).subscribe((resp) => {
        this.caseData = resp[0];
        this.tracksList = this.reorderTrackingIndex(resp[0].tracks, "list");
      })
    );
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

  openDocuments(evidences) {
    let evidencesN = [];
    if (evidences !== null) {
      evidences.map((evi) => {
        evidencesN.push(evi.evidence);
      });
    } else {
      evidencesN = [];
    }
    this.bottomSheet.open(DocumentsViewComponent, {
      data: { evidences: evidencesN },
    });
  }

  openSelectEvidences(viewDetails?: string, trackingData?: any) {
    const caseData = JSON.parse(localStorage.getItem("trackingCaseData"));
    let dialogRef = this.dialog.open(SelectEvidenceComponent, {
      data: { viewDetails, trackingData, caseData },
      autoFocus: false,
      panelClass: "evidences-view-modal",
    });

    // dialogRef.afterOpened().subscribe();

    // dialogRef.afterClosed().subscribe();
  }

  reorderTrackingIndex(tracks: any, action: string, track?: any): any {
    if (action === "new") {
      // const [first] = tracks[0];
      let newTrack;
      if (tracks.length >= 1) {
        newTrack = Object.assign({ index: tracks[0].index + 1 }, track);
      } else {
        newTrack = Object.assign({ index: 1 }, track);
      }
      return [newTrack, ...tracks];
    } else if (action === "list") {
      return tracks.map((track, idx) =>
        Object.assign({ index: tracks.length - idx }, track)
      );
    } else {
      return tracks.map((track, idx) => {
        track.index = tracks.length - idx;
        return track;
      });
    }
  }
}
