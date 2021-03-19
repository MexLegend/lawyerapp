import {
  Component,
  OnInit,
  HostListener,
  Input,
  Inject,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormControl } from "@angular/forms";
import { FileUploadComponent } from "../../modals/file-upload/file-upload.component";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EvidencesService } from "../../services/evidences.service";
import { FilePreviewComponent } from "../../modals/file-preview/file-preview.component";
import { CloudinaryService } from "src/app/services/cloudinary.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { TrackingService } from "src/app/services/tracking.service";
import { CasesService } from "../../services/cases.service";

@Component({
  selector: "app-evidences",
  templateUrl: "./evidences.component.html",
  styleUrls: ["./evidences.component.css"],
})
export class EvidencesComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _casesS: CasesService,
    public _cloudinaryS: CloudinaryService,
    public _evidencesS: EvidencesService,
    public _localStorageS: LocalStorageService,
    public _trackingS: TrackingService
  ) {}

  @Input() modeV: string;
  @Input() caseArchived: string;
  @Input() currentCase: any;
  @Input() currentTracking: any;

  // Get References Of HTML Elements
  @ViewChild("evidencesCarousel", { static: false })
  evidencesCarousel: ElementRef;
  @ViewChild("notesCarousel", { static: false }) notesCarousel: ElementRef;
  @ViewChildren("evidencesArray") evidencesArrayRef: QueryList<ElementRef>;
  @ViewChildren("notesArray") notesArrayRef: QueryList<ElementRef>;

  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

  currentPage: number = 1;
  evidencesArray: HTMLElement[] = [];
  evidences: any = [];
  evidencesStorage: any;
  fileData: any;
  filterValue: string;
  firstEvidenceElement: HTMLElement;
  firstNoteElement: HTMLElement;
  isCaseArchived: boolean = false;
  notesArray: HTMLElement[] = [];
  evidencesPagesNumber: Number = 0;
  selected = new FormControl(0);
  selectedEntry: number = 10;
  selectedEvidences: any[] = [];
  typeDoc: any;

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerScreenWidth = window.innerWidth;
    if (this.innerScreenWidth > 520) {
      this.mobileFilterActivated = false;
    }

    if (this.evidencesArray.length > 0) {
      this.setCarouselPaginationControls("evidences");
    }

    if (this.notesArray.length > 0) {
      this.setCarouselPaginationControls("notes");
    }
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    // Validate If Evidences Case Is Archived
    this._casesS.getIsCaseArchived().subscribe((isArchived) => {
      this.isCaseArchived = isArchived;
    });

    this._evidencesS.getCaseIdSub().subscribe(({ caseId }) => {
      this.evidences = [];
      this.loadEvidences(caseId);
    });

    // Load Current Checked Evidences
    this._evidencesS.getCurrentCheckedEvidences();
  }

  ngAfterViewInit(): void {
    // Fill EvidencesArrayRef With DOM Evidences Obtained
    this.evidencesArrayRef.toArray().map((evidence) => {
      this.evidencesArray = [...this.evidencesArray, evidence.nativeElement];
    });

    // Get First Evidence From DOM Evidences Obtained
    this.evidencesArrayRef.toArray().map((evidence) => {
      this.firstEvidenceElement = evidence.nativeElement;
    });

    // Fill NotesArrayRef With DOM Notes Obtained
    this.notesArrayRef.toArray().map((note) => {
      this.notesArray = [...this.notesArray, note.nativeElement];
    });

    // Get First Note From DOM Notes Obtained
    this.notesArrayRef.toArray().map((note) => {
      this.firstNoteElement = note.nativeElement;
    });

    // Create Pagination Controls Within Number Of Pages From Evidences Control
    if (this.evidencesArray.length > 0 && this.firstEvidenceElement) {
      this.setCarouselPaginationControls("evidences");
    }

    // Create Pagination Controls Within Number Of Pages From Notes Control
    if (this.notesArray.length > 0 && this.firstNoteElement) {
      this.setCarouselPaginationControls("notes");
    }
  }

  addEvidences() {
    this._evidencesS.setShowingListedEvidences();
    this._evidencesS.emitEvidence.emit({ closeModal: true });
  }

  // Add checked evidences to array
  addCheckedEvidences($event, evidence) {
    if ($event.checked) {
      this._evidencesS.setCheckEvidences(evidence, "check");
    } else {
      this._evidencesS.setCheckEvidences(evidence, "uncheck");
    }
  }

  change(value) {
    this.typeDoc = `typeDoc.${value}`;
  }

  changeStatus(idNote: string, statusN: string) {
    this._evidencesS
      .changeStatusEvidence(
        JSON.parse(localStorage.getItem("caseData"))._id,
        idNote,
        statusN
      )
      .subscribe(() => {
        // if(localStorage.getItem('notes') && statusN === 'PUBLIC') {
        //   this._notesS.notesSlc = this._notesS.deleteListedNote(idNote);
        //   this._notesS.setNoteSub("notes");
        // }
        this._evidencesS.emitEvidence.emit({ render: true });
        this._evidencesS.setCaseIdSub(
          "new",
          "caseData",
          JSON.parse(localStorage.getItem("caseData"))
        );
      });
  }

  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  formatType(format: string): string {
    return this._evidencesS.formatType(format);
  }

  getCarouselElementsAndMeasures(rowType: string): any {
    let elementsArrayLength: number;
    let elementsPerPage: number;
    let pagesNumber: number;
    let scrollMeasure: number;

    if (rowType === "evidences") {
      elementsArrayLength = this.evidencesArray.length;
      elementsPerPage =
        this.evidencesCarousel.nativeElement.offsetWidth /
        this.firstEvidenceElement.offsetWidth;
      pagesNumber = Math.ceil(elementsArrayLength / elementsPerPage);
      scrollMeasure = elementsPerPage * this.firstEvidenceElement.offsetWidth;
    } else {
      elementsArrayLength = this.notesArray.length;
      elementsPerPage =
        this.notesCarousel.nativeElement.offsetWidth /
        this.firstNoteElement.offsetWidth;
      pagesNumber = Math.ceil(elementsArrayLength / elementsPerPage);
      scrollMeasure = elementsPerPage * this.firstNoteElement.offsetWidth;
    }

    return [pagesNumber, scrollMeasure];
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  setCarouselRowControlsVisibility(rowType: string, visibility: string) {
    if (rowType === "evidences") {
      const rowControls: any = document.querySelectorAll(
        ".evidence-row-indicator"
      );
      [...rowControls].forEach((control) => {
        if (visibility === "hide") {
          control.style.display = "none";
        } else {
          control.style.display = "flex";
        }
      });
      // paginationControlContainer.innerHTML = "";
    } else {
      const rowControls: any = document.querySelectorAll(".note-row-indicator");
      [...rowControls].forEach((control) => {
        if (visibility === "hide") {
          control.style.display = "none";
        } else {
          control.style.display = "flex";
        }
      });
    }
  }

  // Compare Local Storage Checked Notes With Existing Ones
  isEvidenceChecked(idEvidence: any): boolean {
    let isChecked: boolean;

    isChecked =
      this._evidencesS.getShowingCheckedEvidences().length >= 1
        ? this._evidencesS
            .getShowingCheckedEvidences()
            .some((evidence: any) => evidence._id === idEvidence)
        : false;

    return isChecked;
  }

  loadEvidences(caseId: string) {
    this._evidencesS.getEvidences(caseId).subscribe((resp) => {
      if (resp.docs.length >= 1 && resp.docs[0].evidences.length >= 1) {
        resp.docs[0].evidences.filter((evidence) => {
          if (this.modeV === "new" && evidence.status !== "DELETED") {
            this.evidences.push(evidence);
          } else if (this.modeV === "select" && evidence.status === "PUBLIC") {
            this._localStorageS.addLocalStorageItem(
              "evidenceId",
              resp.docs[0]._id
            );
            this.evidences.push(evidence);
          }
        });
      } else {
        this.evidences = [];
      }
    });
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  // Open Files Upload Modal
  openFileUploadModal() {
    let dialogRef = this.dialog.open(FileUploadComponent, {
      autoFocus: false,
      data: { typeUpload: "file" },
    });

    dialogRef.afterOpened().subscribe((result) => {
      $("body").css("overflow", "hidden");
    });

    dialogRef.afterClosed().subscribe((result) => {
      $("body").css("overflow", "");
      this._cloudinaryS.clearQueue();
    });
  }

  openFileViewModal(path: string, name: string) {
    let dialogRef = this.dialog.open(FilePreviewComponent, {
      data: { path, name },
      autoFocus: false,
      panelClass: "file-view-modal",
    });
  }

  setCarouselPaginationControls(rowType: string) {
    const [pagesNumber, scrollMeasure] = this.getCarouselElementsAndMeasures(
      rowType
    );

    if (pagesNumber >= 2) {
      if (rowType === "evidences") {
        const paginationControlContainer = document.querySelector(
          ".evidences-controls"
        );
        paginationControlContainer.innerHTML = "";
        this.setCarouselRowControlsVisibility("evidences", "show");

        for (let index = 0; index < pagesNumber; index++) {
          const paginationControl = document.createElement("button");
          const offSetWidth: Number =
            this.evidencesCarousel.nativeElement.offsetWidth * index;

          if (index === 0) {
            paginationControl.classList.add("activo");
          }

          paginationControl.addEventListener("click", (e: any) => {
            this.scrollCarouselToRight("evidences", offSetWidth);
            document
              .querySelector(".evidences-controls .activo")
              .classList.remove("activo");
            e.target.classList.add("activo");
          });

          paginationControlContainer.appendChild(paginationControl);
        }
      } else {
        const paginationControlContainer = document.querySelector(
          ".notes-controls"
        );

        paginationControlContainer.innerHTML = "";
        this.setCarouselRowControlsVisibility("notes", "show");

        for (let index = 0; index < pagesNumber; index++) {
          const paginationControl = document.createElement("button");
          const offSetWidth: Number =
            this.notesCarousel.nativeElement.offsetWidth * index;

          if (index === 0) {
            paginationControl.classList.add("activo");
          }

          paginationControl.addEventListener("click", (e: any) => {
            this.scrollCarouselToRight("notes", offSetWidth);
            document
              .querySelector(".notes-controls .activo")
              .classList.remove("activo");
            e.target.classList.add("activo");
          });

          paginationControlContainer.appendChild(paginationControl);
        }
      }
    } else {
      if (rowType === "evidences") {
        const paginationControlContainer = document.querySelector(
          ".evidences-controls"
        );
        paginationControlContainer.innerHTML = "";
        this.setCarouselRowControlsVisibility("evidences", "hide");
      } else {
        const paginationControlContainer = document.querySelector(
          ".notes-controls"
        );
        paginationControlContainer.innerHTML = "";
        this.setCarouselRowControlsVisibility("notes", "hide");
      }
    }
  }

  scrollCarouselToRight(rowType: string, offsetWidth?: any) {
    const [pagesNumber, scrollMeasure] = this.getCarouselElementsAndMeasures(
      rowType
    );
    if (rowType === "evidences") {
      const activeControl: any = document.querySelector(
        ".evidences-controls .activo"
      );

      if (offsetWidth >= 0) {
        this.evidencesCarousel.nativeElement.scrollLeft = offsetWidth;
      } else {
        if (activeControl.nextSibling) {
          activeControl.nextSibling.classList.add("activo");
          activeControl.classList.remove("activo");
        }
        this.evidencesCarousel.nativeElement.scrollLeft += scrollMeasure;
      }
    } else {
      const activeControl: any = document.querySelector(
        ".notes-controls .activo"
      );
      if (offsetWidth >= 0) {
        this.notesCarousel.nativeElement.scrollLeft = offsetWidth;
      } else {
        if (activeControl.nextSibling) {
          activeControl.nextSibling.classList.add("activo");
          activeControl.classList.remove("activo");
        }
        this.notesCarousel.nativeElement.scrollLeft += scrollMeasure;
      }
    }
  }

  scrollCarouselToLeft(rowType: string) {
    const [pagesNumber, scrollMeasure] = this.getCarouselElementsAndMeasures(
      rowType
    );

    if (rowType === "evidences") {
      const activeControl: any = document.querySelector(
        ".evidences-controls .activo"
      );
      if (activeControl.previousSibling) {
        activeControl.previousSibling.classList.add("activo");
        activeControl.classList.remove("activo");
      }
      this.evidencesCarousel.nativeElement.scrollLeft -= scrollMeasure;
    } else {
      const activeControl: any = document.querySelector(
        ".notes-controls .activo"
      );
      if (activeControl.previousSibling) {
        activeControl.previousSibling.classList.add("activo");
        activeControl.classList.remove("activo");
      }
      this.notesCarousel.nativeElement.scrollLeft -= scrollMeasure;
    }
  }

  // Go Step Back
  return() {
    this._trackingS.setActiveCaseTabSub(0);
  }

  // View Files List Function
  viewFilesList(data: any) {
    this.fileData = data;
  }
}
