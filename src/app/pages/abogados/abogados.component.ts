import { Component, OnInit, HostListener } from "@angular/core";
import { Subscription } from "rxjs";
import { UsersService } from "../../services/users.service";
import { User } from "../../models/User";
import { ChatService } from "../../services/chat.service";
import { Router } from "@angular/router";
import { ContactService } from "../../services/contact.service";
import { ModalAlertService } from "../../services/modal-alert.service";
import { UtilitiesService } from "../../services/utilities.service";
import { MatDialog } from "@angular/material/dialog";
import { RateComponent } from "../../modals/rate/rate.component";

@Component({
  selector: "app-abogados",
  templateUrl: "./abogados.component.html",
  styleUrls: ["./abogados.component.css"],
})
export class AbogadosComponent implements OnInit {
  constructor(
    public _alertModalS: ModalAlertService,
    public _chatS: ChatService,
    public _contactS: ContactService,
    public dialog: MatDialog,
    private router: Router,
    public _usersS: UsersService,
    public _utilitiesS: UtilitiesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  currentPage: number = 1;
  filterValue: string;
  isModalAlertRendered: boolean = false;
  lawyers: User[] = [];
  modalAlertRef: any = null;
  selectedEntry: number = 10;

  // Close Reaction Alert Modal When Its Clicked Outside
  @HostListener("document:click", ["$event"])
  onGlobalClick(event: any): void {
    if (this.isModalAlertRendered && !event.target.closest(".reactionModal")) {
      this.modalAlertRef.close();
      this._utilitiesS.setModalAlertState(false);
    }
  }

  ngOnInit() {
    // List Lawyers Subscription
    this.subscriptionsArray.push(
      this._usersS.getLawyers().subscribe((lawyers: any) => {
        this.lawyers = lawyers;
      })
    );

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

  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  openChat(lawyerData: User) {
    this._chatS.setLawyerRoomData(lawyerData);
    this._chatS.openChat();
  }

  // Open Rate Modal
  openRateModal(action: string, lawyer?: any, lawyersList?: User[]) {
    let dialogRef = this.dialog.open(RateComponent, {
      data: {
        inputData: lawyer,
        dataList: lawyersList,
        action,
        dataType: "User",
      },
      autoFocus: false,
      disableClose: true,
    });
  }

  // Scroll to Top of New Page
  scrollToTop() {
    window.scrollTo(0, 0);
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
