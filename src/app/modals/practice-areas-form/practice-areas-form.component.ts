import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  HostListener,
  QueryList,
  ViewChildren,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatStepper,
  MatDialog,
} from "@angular/material";
import { PracticeArea } from "../../models/PracticeArea";
import { Subscription } from "rxjs";
import { PracticeAreasService } from "../../services/practice-areas.service";
import { UsersService } from "../../services/users.service";
import { User } from "../../models/User";
import { UtilitiesService } from "../../services/utilities.service";
import { FAQComponent } from "../faq/faq.component";
import { ReferencesComponent } from "../references/references.component";

@Component({
  selector: "app-practice-areas-form",
  templateUrl: "./practice-areas-form.component.html",
  styleUrls: ["./practice-areas-form.component.css"],
})
export class PracticeAreasFormComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    public practiceAreaFormRef: MatDialogRef<PracticeAreasFormComponent>,
    @Inject(MAT_DIALOG_DATA) public practiceAreaData: any,
    private _practiceAreaS: PracticeAreasService,
    public _usersS: UsersService,
    public _utilitiesS: UtilitiesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  checkboxAction: string = "Seleccionar";
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  filterValue: string;
  innerScreenWidth: any;
  is_category: boolean = false;
  lawyers: Array<User> = [];
  mobileFilterActivated: boolean = false;
  practiceAreaDataFormAction: string = "";
  practiceAreaDataFormType: string = "";
  practiceAreaForm: FormGroup;
  practiceAreaFAQsList: any = [];
  practiceAreaReferencesList: any = [];
  practiceAreaSpecializedLawyersList: any = [];
  selectedEntry: number = 10;

  @ViewChildren("lawyersCheckbox") private lawyersCheckbox: QueryList<any>;

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

    this.initPracticeAreaForm();

    // Get Lawyers List
    this.subscriptionsArray.push(
      this._usersS
        .getLawyers()
        .subscribe((lawyers: any) => (this.lawyers = lawyers))
    );

    // Get FAQs List
    this.subscriptionsArray.push(
      this._practiceAreaS
        .getFAQsList()
        .subscribe(([faqs, action]) =>
          faqs.map(
            (faq: any) =>
              (this.practiceAreaFAQsList = this._utilitiesS.upsertArrayItems(
                this.practiceAreaFAQsList,
                faq,
                action
              ))
          )
        )
    );

    // Get References List
    this.subscriptionsArray.push(
      this._practiceAreaS
        .getReferencesList()
        .subscribe(([references, action]) =>
          references.map(
            (reference: any) =>
              (this.practiceAreaReferencesList = this._utilitiesS.upsertArrayItems(
                this.practiceAreaReferencesList,
                reference,
                action
              ))
          )
        )
    );

    // Create / Update Pracetice Area
    if (this.practiceAreaData) {
      this.practiceAreaDataFormAction = this.practiceAreaData.action;
      this.practiceAreaDataFormType = this.practiceAreaData.type;
      this.is_category = this.practiceAreaData.is_category;

      if (this.practiceAreaData._id && this.practiceAreaData._id !== "") {
        // Initialize Practice Area Details With Obtained Data
        this.practiceAreaForm.patchValue({
          name: this.practiceAreaData.name,
          review: this.practiceAreaData.review,
          _id: this.practiceAreaData._id,
        });
        // Set FAQs List With Obtained Data
        if (this.practiceAreaData.faq) {
          this._practiceAreaS.setFAQsList(this.practiceAreaData.faq, "list");
        }
        // Set References List With Obtained Data
        if (this.practiceAreaData.references) {
          this._practiceAreaS.setReferencesList(
            this.practiceAreaData.references,
            "list"
          );
        }
        // Set Specialized Lawyers List With Obtained Data
        this._practiceAreaS
          .getSpecializedLawyers(this.practiceAreaData._id)
          .subscribe((specializedLawyers) => {
            this.checkUncheck(specializedLawyers, "selectSome");
            this.practiceAreaSpecializedLawyersList = specializedLawyers;
          });
      } else {
        this.practiceAreaForm.reset();
      }
    }
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  closeModal() {
    this.practiceAreaForm.reset();
    this.practiceAreaFormRef.close();
  }

  createPracticeAreaObject(details: any): any {
    const faqsData = this.practiceAreaFAQsList.map(
      ({ _id: idFAQ, ...faqsData }) => ({ ...faqsData })
    );

    const referencesData = this.practiceAreaReferencesList.map(
      ({ _id: idReference, ...referenecesData }) => ({ ...referenecesData })
    );

    const lawyers = this.lawyersCheckbox
      .toArray()
      .filter((checkbox) => checkbox.checked)
      .map((checkboxId) => checkboxId.value);

    return {
      ...{ is_category: this.is_category, ...details },
      ...{ faq: faqsData },
      ...{ references: referencesData },
      ...{ lawyers },
    };
  }

  createOrUpdatePracticeArea() {
    const {
      _id: idPracticeArea,
      ...practiceAreaDetails
    } = this.practiceAreaForm.value;

    const {
      lawyers: lawyers,
      ...practiceAreaData
    } = this.createPracticeAreaObject(practiceAreaDetails);

    // Update Practice Area Data
    if (this.practiceAreaForm.value._id !== null) {
      this.subscriptionsArray.push(
        this._practiceAreaS
          .updatePracticeArea(
            this._usersS.user,
            idPracticeArea,
            practiceAreaData,
            this.getNewOldLawyers(
              lawyers,
              this.practiceAreaSpecializedLawyersList
            )
          )
          .subscribe(() => {
            this.closeModal();
          })
      );
      // Create New Practice Area
    } else {
      this.subscriptionsArray.push(
        this._practiceAreaS
          .createPracticeArea(this._usersS.user, practiceAreaData, lawyers)
          .subscribe(() => {
            this.closeModal();
          })
      );
    }
  }

  // Pop Item From FAQs / References Array
  deleteElementFromArray(item: any, arrayType: string) {
    if (arrayType === "FAQ") {
      this._practiceAreaS.setFAQsList([item], "delete");
    } else {
      this._practiceAreaS.setReferencesList([item], "delete");
    }
  }

  // Filter Specialized Lawyers By Condition
  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  getNewOldLawyers(finalLawyersList: any, oldLawyersList: any): any {
    const newLawyers = finalLawyersList.filter(
      (newLawyerId: any) =>
        !oldLawyersList.some((oldLawyer: any) => newLawyerId === oldLawyer._id)
    );

    const sameLawyers = oldLawyersList.filter((oldLawyer: any) =>
      finalLawyersList.some((newLawyerId: any) => newLawyerId === oldLawyer._id)
    );

    const removedLawyers = oldLawyersList
      .filter(
        (oldLawyer: any) =>
          !sameLawyers.some(
            (sameLawyer: any) => sameLawyer._id === oldLawyer._id
          )
      )
      .map((lawyerId: any) => lawyerId._id);

    return { newLawyers, removedLawyers };
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  private initPracticeAreaForm() {
    this.practiceAreaForm = this._formBuilder.group({
      name: new FormControl(null, Validators.required),
      review: new FormControl(null),
      _id: new FormControl(null),
    });
  }

  // Open Frecuently Asked Questions Modal
  openFAQsModal(faqData?: string) {
    let dialogRef =
      faqData && faqData !== ""
        ? this.dialog.open(FAQComponent, {
            id: "FAQModal",
            data: { faqData, action: "Editar" },
            autoFocus: false,
            width: "600px",
          })
        : this.dialog.open(FAQComponent, {
            id: "FAQModal",
            data: { action: "Crear" },
            autoFocus: false,
            width: "600px",
          });

    // dialogRef.afterClosed().subscribe(result => {
    //   localStorage.removeItem('userData');
    //   localStorage.removeItem('fileData');
    //   this._updateDS.setUserData(null);
    // });
  }

  // Open References Modal
  openReferencesModal(referenceData?: string, action?: string) {
    let dialogRef =
      referenceData && referenceData !== ""
        ? this.dialog.open(ReferencesComponent, {
            id: "ReferenceModal",
            data: { referenceData, action: "Editar", type: "Referencia" },
            autoFocus: false,
            width: "600px",
          })
        : this.dialog.open(ReferencesComponent, {
            id: "ReferenceModal",
            data: { action: "Agregar", type: "Referencia" },
            autoFocus: false,
            width: "600px",
          });

    // dialogRef.afterClosed().subscribe(result => {
    //   localStorage.removeItem('userData');
    //   localStorage.removeItem('fileData');
    //   this._updateDS.setUserData(null);
    // });
  }

  checkUncheck(checkboxHandler: any, action: string) {
    this.lawyersCheckbox.toArray().map((checkbox) => {
      if (action === "selectAll") {
        if (checkboxHandler.checked) {
          checkbox.checked = true;
          this.checkboxAction = "Deseleccionar";
        } else {
          checkbox.checked = false;
          this.checkboxAction = "Seleccionar";
        }
      } else {
        checkboxHandler.map((item: any) =>
          item._id === checkbox.value
            ? (checkbox.checked = true)
            : checkbox.checked
        );
      }
    });
  }
}
