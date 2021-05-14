import { Component, OnInit, HostListener } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Contact } from "../../../models/Contact";
import { ContactService } from "../../../services/contact.service";
import { Subscription } from "rxjs";
import { UsersService } from "../../../services/users.service";
import { ChatService } from "../../../services/chat.service";
import { User } from "../../../models/User";
import { UtilitiesService } from "../../../services/utilities.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ModalAlertService } from "../../../services/modal-alert.service";
import { PracticeAreasService } from "../../../services/practice-areas.service";
import { PracticeArea } from "../../../models/PracticeArea";
import { Location } from "@angular/common";

@Component({
  selector: "app-area-detail",
  templateUrl: "./area-detail.component.html",
  styleUrls: ["./area-detail.component.css"],
})
export class AreaDetailComponent implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    public _alertModalS: ModalAlertService,
    public _chatS: ChatService,
    public _contactS: ContactService,
    private _practiceAreaS: PracticeAreasService,
    private router: Router,
    public _usersS: UsersService,
    public _utilitiesS: UtilitiesService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.currentPracticeAreaId = params["id"];
      if (this.currentPracticeAreaId !== "new") {
        // Load Current Practice Area Data
        this.loadPracticeArea(this.currentPracticeAreaId);

        // Load Specialized Lawyers Data
        this.loadSpecializedLawyersArea(this.currentPracticeAreaId);
      }
    });

    // Change Active Tab To Specialized Lawyers If QueryParams Are True
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params["abogados"]) {
        this.selected.setValue(1);
      }
    });
  }

  subscriptionsArray: Subscription[] = [];

  currentPracticeArea: PracticeArea = null;
  currentPracticeAreaId: string;
  form: FormGroup;
  isModalAlertRendered: boolean = false;
  lawyers: User[] = [];
  modalAlertRef: any = null;
  practiceAreasList: Array<PracticeArea> = [];
  selected = new FormControl(0);
  specializedLawyers: Array<User> = [];

  // Close Reaction Alert Modal When Its Clicked Outside
  @HostListener("document:click", ["$event"])
  onGlobalClick(event: any): void {
    if (this.isModalAlertRendered && !event.target.closest(".reactionModal")) {
      this.modalAlertRef.close();
      this._utilitiesS.setModalAlertState(false);
    }
  }

  ngOnInit() {
    // List Practice Areas List From Local Storage
    this.practiceAreasList = JSON.parse(localStorage.getItem("practiceAreas"));

    // Get Modal Alert Subscription
    this.subscriptionsArray.push(
      this._alertModalS.getModalAlertRef().subscribe((modalRef) => {
        this.modalAlertRef = modalRef;
      })
    );

    //Get Modal Alert State
    this.subscriptionsArray.push(
      this._utilitiesS.getModalAlertState().subscribe((state) => {
        this.isModalAlertRendered = state;
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

  // Load Current Practice Area Info
  loadPracticeArea(id: any) {
    this.subscriptionsArray.push(
      this._practiceAreaS.getPracticeArea(id).subscribe((practiceArea: any) => {
        this.currentPracticeArea = practiceArea;
      })
    );
  }

  // Load Specialized Lawyers Data
  loadSpecializedLawyersArea(id: any) {
    this.subscriptionsArray.push(
      this._practiceAreaS
        .getSpecializedLawyers(id)
        .subscribe((lawyers: any) => {
          this.specializedLawyers = lawyers;
        })
    );
  }

  openChat(lawyerData: User) {
    this._chatS.setLawyerRoomData(lawyerData);
    this._chatS.openChat();
  }

  // Show Modal Alert When The User Who Is Reacting Is Not Logged In
  showAlertModal(action: string, event: any) {
    this._utilitiesS.showAlertModal(
      action,
      this._alertModalS,
      this.isModalAlertRendered,
      event
    );
  }

  // Go to Lawyer Details Module
  viewLawyerDetails(id: string): void {
    this.router.navigate([`/abogado-detalle/${id}`]);
  }
}
