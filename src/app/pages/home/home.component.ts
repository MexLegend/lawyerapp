import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { UtilitiesService } from "../../services/utilities.service";
import { HostListener } from "@angular/core";
import { Post } from "../../models/Post";
import { Subscription } from "rxjs";
import { PostsService } from "../../services/posts.service";
import { Router } from "@angular/router";
import { UsersService } from "../../services/users.service";
import { User } from "../../models/User";
import { ChatService } from "../../services/chat.service";
import { ContactService } from "../../services/contact.service";
import { ModalAlertService } from "../../services/modal-alert.service";
import { PracticeAreasService } from "../../services/practice-areas.service";
import { PracticeArea } from "src/app/models/PracticeArea";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(
    public _alertModalS: ModalAlertService,
    public _chatS: ChatService,
    public _contactS: ContactService,
    public _practiceAreaS: PracticeAreasService,
    public _postsS: PostsService,
    private router: Router,
    public _usersS: UsersService,
    public _utilitiesS: UtilitiesService
  ) {}

  // Get References Of HTML Elements
  @ViewChild("partenersCarousel", {static: false}) partnersRef: ElementRef;
  @ViewChild("postsCarousel", {static: false}) postsRef: ElementRef;

  @ViewChildren("partnersArray") partnersArray: QueryList<ElementRef>;
  @ViewChildren("postsArray") postsArray: QueryList<ElementRef>;

  subscriptionsArray: Subscription[] = [];

  currentPage: number = 1;
  firstPartnerElement: HTMLElement;
  firstPostElement: HTMLElement;
  firstPracticeAreaElement: HTMLElement;
  isModalAlertRendered: boolean = false;
  lawyers: User[] = [];
  modalAlertRef: any = null;
  partnersArrayList: HTMLElement[] = [];
  posts: Post[] = [];
  postsArrayList: HTMLElement[] = [];
  practiceAreasList: Array<PracticeArea> = [];

  // Detect Real Screen Size
  @HostListener("window:resize", [])
  onResize() {
    if (this.partnersArrayList.length > 0) {
      this._utilitiesS.setCarouselPaginationControls(
        this.partnersArrayList,
        this.partnersRef,
        ".partners-controls",
        this.firstPartnerElement,
        ".partners-row-indicator"
      );
    }

    if (this.postsArrayList.length > 0) {
      this._utilitiesS.setCarouselPaginationControls(
        this.postsArrayList,
        this.postsRef,
        ".posts-controls",
        this.firstPostElement,
        ".posts-row-indicator"
      );
    }

    // if (this.practiceAreasList.length > 0) {
    //   this._utilitiesS.setCarouselPaginationControls(
    //     this.practiceAreasList,
    //     this.practiceAreasRef,
    //     ".practice-areas-controls",
    //     this.firstPracticeAreaElement,
    //     ".practice-areas-row-indicator"
    //   );
    // }
  }

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

    // List Last 10 Posts Subscription
    this.subscriptionsArray.push(
      this._postsS.getPosts(true).subscribe((resp) => {
        this.posts = resp.docs;
      })
    );

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

  ngAfterViewInit() {
    // Init Lawyer Partners Carousel
    this.subscriptionsArray.push(
      this.partnersArray.changes.subscribe(() => {
        if (
          this.partnersArray.toArray().length > 0 &&
          this.partnersArrayList.length === 0
        ) {
          // Fill PartnersArray And Get First Partner With DOM Partners Obtained
          this.partnersArray.toArray().map((partner) => {
            this.partnersArrayList = [
              ...this.partnersArrayList,
              partner.nativeElement,
            ];

            this.firstPartnerElement = partner.nativeElement;
          });

          // Create Pagination Controls Within Number Of Pages From Partners Control
          if (this.partnersArrayList.length > 0 && this.firstPartnerElement) {
            this._utilitiesS.setCarouselPaginationControls(
              this.partnersArrayList,
              this.partnersRef,
              ".partners-controls",
              this.firstPartnerElement,
              ".partners-row-indicator"
            );
          }
        }
      })
    );

    // Init Last Posts Carousel
    this.subscriptionsArray.push(
      this.postsArray.changes.subscribe(() => {
        if (
          this.postsArray.toArray().length > 0 &&
          this.postsArrayList.length === 0
        ) {
          // Fill LastPostsArray And Get First Partner With DOM Last Posts Obtained
          this.postsArray.toArray().map((post) => {
            this.postsArrayList = [...this.postsArrayList, post.nativeElement];
            this.firstPostElement = post.nativeElement;
          });

          // Create Pagination Controls Within Number Of Pages From Last Posts Control
          if (this.postsArrayList.length > 0 && this.firstPostElement) {
            this._utilitiesS.setCarouselPaginationControls(
              this.postsArrayList,
              this.postsRef,
              ".posts-controls",
              this.firstPostElement,
              ".posts-row-indicator"
            );
          }
        }
      })
    );
  }

  // Go to News Comments Section
  goToComments(id: string): void {
    this._utilitiesS.goToComments(id, this.router);
  }

  openChat(lawyerData: User) {
    this._chatS.setLawyerRoomData(lawyerData);
    this._chatS.openChat();
  }

  scrollCarouselToLeft(actionType: string, controlsType: string) {
    switch (actionType) {
      case "partners":
        this._utilitiesS.scrollCarouselToLeft(
          this.partnersArrayList,
          this.partnersRef,
          controlsType,
          this.firstPartnerElement
        );
        break;

      // case "practice-areas":
      //   this._utilitiesS.scrollCarouselToLeft(
      //     this.practiceAreasList,
      //     this.practiceAreasRef,
      //     controlsType,
      //     this.firstPracticeAreaElement
      //   );
      //   break;

      default:
        this._utilitiesS.scrollCarouselToLeft(
          this.postsArrayList,
          this.postsRef,
          controlsType,
          this.firstPostElement
        );
        break;
    }
  }

  scrollCarouselToRight(
    actionType: string,
    controlsType: string,
    offsetWidth?: any
  ) {
    switch (actionType) {
      case "partners":
        this._utilitiesS.scrollCarouselToRight(
          this.partnersArrayList,
          this.partnersRef,
          controlsType,
          this.firstPartnerElement,
          offsetWidth
        );
        break;

      // case "practice-areas":
      //   this._utilitiesS.scrollCarouselToRight(
      //     this.practiceAreasList,
      //     this.practiceAreasRef,
      //     controlsType,
      //     this.firstPracticeAreaElement,
      //     offsetWidth
      //   );
      //   break;

      default:
        this._utilitiesS.scrollCarouselToRight(
          this.postsArrayList,
          this.postsRef,
          controlsType,
          this.firstPostElement,
          offsetWidth
        );
        break;
    }
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
