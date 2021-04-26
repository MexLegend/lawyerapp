import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { ContactService } from "../../services/contact.service";
import { HostListener } from "@angular/core";
import { ModalAlertService } from "../../services/modal-alert.service";
import { OwlOptions } from "ngx-owl-carousel-o";
import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";
import { PracticeArea } from "src/app/models/PracticeArea";
import { PracticeAreasService } from "../../services/practice-areas.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { UtilitiesService } from "../../services/utilities.service";
import { User } from "../../models/User";
import { UsersService } from "../../services/users.service";

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
  @ViewChild("partenersCarousel", { static: false }) partnersRef: ElementRef;
  @ViewChild("postsCarousel", { static: false }) postsRef: ElementRef;

  @ViewChildren("partnersArray") partnersArray: QueryList<ElementRef>;
  @ViewChildren("postsArray") postsArray: QueryList<ElementRef>;

  subscriptionsArray: Subscription[] = [];

  partnersCarosuelOptions: OwlOptions = {
    autoplay: true,
    autoplayHoverPause: true,
    dots: true,
    loop: true,
    margin: 10,
    nav: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      840: {
        items: 3,
      },
      1300: {
        items: 4,
      },
    },
  };

  postsCarosuelOptions: OwlOptions = {
    autoplay: true,
    autoplayHoverPause: true,
    dots: true,
    loop: true,
    margin: 10,
    nav: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      840: {
        items: 3,
      },
      1300: {
        items: 4,
      },
    },
  };

  currentPage: number = 1;
  firstPartnerElement: HTMLElement;
  firstPostElement: HTMLElement;
  firstPracticeAreaElement: HTMLElement;
  innerScreenWidth: number = 0;
  isModalAlertRendered: boolean = false;
  lawyers: User[] = [];
  modalAlertRef: any = null;
  partnersArrayList: HTMLElement[] = [];
  partnersTimer: any;
  posts: Array<Post> = [];
  postsArrayList: HTMLElement[] = [];
  postsTimer: any;
  practiceAreasList: Array<PracticeArea> = [];

  // Detect Real Screen Size
  @HostListener("window:resize", [])
  onResize() {
    this.innerScreenWidth = window.innerWidth;
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
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

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

  displayedCarouselItems(): number {
    if (window.innerWidth >= 1300) return 5;
    else if (window.innerWidth >= 1100 && window.innerWidth < 1300) return 4;
    else if (window.innerWidth >= 840 && window.innerWidth < 1100) return 3;
    else if (window.innerWidth >= 600 && window.innerWidth < 840) return 2;
    else if (window.innerWidth < 600) return 1;
  }

  // Go to News Comments Section
  goToComments(id: any): void {
    this.router.navigate([`/articulo-detalle/${id}`], {
      state: { comments: true },
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

  // Go to Lawyer Details Module
  viewLawyerDetails(id: string): void {
    this.router.navigate([`/abogado-detalle/${id}`]);
  }

  // Go to Posts Details Module
  viewPostDetails(id: string): void {
    this.router.navigate([`/articulo-detalle/${id}`]);
  }
}
