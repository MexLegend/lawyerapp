import { Component, OnInit, HostListener } from "@angular/core";
import { UtilitiesService } from "../../services/utilities.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { MatDialog } from "@angular/material";
import { PracticeArea } from "src/app/models/PracticeArea";
import { PracticeAreasFormComponent } from "../../modals/practice-areas-form/practice-areas-form.component";
import { Subscription } from "rxjs";
import { PracticeAreasService } from "../../services/practice-areas.service";

@Component({
  selector: "app-practice-areas",
  templateUrl: "./practice-areas.component.html",
  styleUrls: ["./practice-areas.component.css"],
})
export class PracticeAreasComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public _practiceAreaS: PracticeAreasService,
    public _utilitiesS: UtilitiesService
  ) {}

  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

  subscriptionsArray: Subscription[] = [];

  currentPage: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  filterValue: string;
  selectedEntry: number = 10;
  practiceAreasList: Array<PracticeArea> = [];

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.innerScreenWidth = window.innerWidth;
    if (this.innerScreenWidth > 520) {
      this.mobileFilterActivated = false;
    }
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    // Get Practice Areas Supcription
    this.subscriptionsArray.push(
      this._practiceAreaS.getPracticeAreas("ALL").subscribe()
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

  // Change Current Pagination Page
  changeEntry($event: any) {
    this.selectedEntry = $event;
    this.currentPage = 1;
  }

  deletePracticeArea(idPracticeArea: string) {
    const practiceAreaDeletedSub = this._practiceAreaS
      .deletePracticeAreaTemporary(idPracticeArea)
      .subscribe(() => {
        practiceAreaDeletedSub.unsubscribe();
      });
  }

  // Filter Users By Condition
  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  // Open Practice Areas Modal
  openPracticeAreasModal(practiceAreaData?: any) {
    let dialogRef =
      practiceAreaData && practiceAreaData !== ""
        ? this.dialog.open(PracticeAreasFormComponent, {
            id: "practiceAreaModal",
            data: {
              ...practiceAreaData,
              action: "Editar Área de Práctica",
              type: "Complete",
            },
            autoFocus: false,
          })
        : this.dialog.open(PracticeAreasFormComponent, {
            id: "practiceAreaModal",
            data: {
              action: "Crear Área de Práctica",
              type: "Complete",
              is_category: false,
            },
            autoFocus: false,
          });

    // dialogRef.afterClosed().subscribe(result => {
    //   localStorage.removeItem('userData');
    //   localStorage.removeItem('fileData');
    //   this._updateDS.setUserData(null);
    // });
  }

  publishPracticeArea(idPracticeArea: string, state: string) {
    const practiceAreaPublishedSub = this._practiceAreaS
      .updatePracticeAreaState(idPracticeArea, state)
      .subscribe(() => {
        practiceAreaPublishedSub.unsubscribe();
      });
  }
}
