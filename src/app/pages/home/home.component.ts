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
import { MatDialog } from "@angular/material/dialog";
import { ReplyComponent } from "../../modals/reply/reply.component";
import { UsersService } from "../../services/users.service";
import { User } from "../../models/User";
import { ChatService } from "../../services/chat.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(
    public _chatS: ChatService,
    public dialog: MatDialog,
    public _postsS: PostsService,
    private router: Router,
    public _usersS: UsersService,
    public _utilitiesS: UtilitiesService
  ) {}

  // Get References Of HTML Elements
  @ViewChild("partenersCarousel", null) partnersRef: ElementRef;
  @ViewChild("postsCarousel", null) postsRef: ElementRef;
  @ViewChildren("partnersArray") partnersArray: QueryList<ElementRef>;
  @ViewChildren("postsArray") postsArray: QueryList<ElementRef>;

  subscriptionsArray: Subscription[] = [];

  currentPage: number = 1;
  firstPartnerElement: HTMLElement;
  firstPostElement: HTMLElement;
  lawyers: User[] = [];
  partnersArrayList: HTMLElement[] = [];
  posts: Post[] = [];
  postsArrayList: HTMLElement[] = [];

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
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

  openChat(lawyerData: User) {
    this._chatS.setLawyerRoomData(lawyerData);
    this._chatS.openChat();
  }

  // Open Users Modal
  openReplyModal(user?: any) {
    let dialogRef = this.dialog.open(ReplyComponent, {
      data: { user, action: "Nuevo" },
      autoFocus: false,
    });
  }
}
