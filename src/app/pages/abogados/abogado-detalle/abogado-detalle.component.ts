import { Component, OnInit, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UsersService } from "../../../services/users.service";
import { User } from "../../../models/User";
import { FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { PostsService } from "../../../services/posts.service";
import { Post } from "../../../models/Post";
import { ContactService } from "../../../services/contact.service";
import { ModalAlertService } from "../../../services/modal-alert.service";
import { UtilitiesService } from "../../../services/utilities.service";
import { ChatService } from "../../../services/chat.service";

@Component({
  selector: "app-abogado-detalle",
  templateUrl: "./abogado-detalle.component.html",
  styleUrls: ["./abogado-detalle.component.css"],
})
export class AbogadoDetalleComponent implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    public _alertModalS: ModalAlertService,
    public _chatS: ChatService,
    public _contactS: ContactService,
    public _postsS: PostsService,
    public _usersS: UsersService,
    public _utilitiesS: UtilitiesService
  ) {}

  subscriptionsArray: Subscription[] = [];

  isModalAlertRendered: boolean = false;
  lawyer: User = null;
  lawyerPosts: any = null;
  modalAlertRef: any = null;
  currentLawyerId: string;
  selected = new FormControl(0);

  // Close Reaction Alert Modal When Its Clicked Outside
  @HostListener("document:click", ["$event"])
  onGlobalClick(event: any): void {
    if (this.isModalAlertRendered && !event.target.closest(".reactionModal")) {
      this._utilitiesS.setModalAlertState(false);
      this.modalAlertRef.close();
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.currentLawyerId = params["id"];

      if (this.currentLawyerId !== "new") {
        // Load Current Lawyer Data
        this.loadLawyer(this.currentLawyerId);

        // List Posts Of Lawyer
        this.subscriptionsArray.push(
          this._postsS
            .getPostsByLawyer(this.currentLawyerId)
            .subscribe((posts) => {
              this.lawyerPosts = posts.docs;
            })
        );
      }
    });

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

  // Load Data From Current Lawyer
  loadLawyer(id: string) {
    this._usersS.getLawyer(id).subscribe((lawyer) => {
      this.lawyer = lawyer;
    });
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
}