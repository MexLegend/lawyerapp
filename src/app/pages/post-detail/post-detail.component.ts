import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";

import { LawyerContactComponent } from "src/app/modals/lawyer-contact/lawyer-contact.component";
import { PostAnalytics } from "src/app/models/PostAnalytics";
import { PostsAnalyticsService } from "src/app/services/posts-analytics.service";

import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";
import { UsersService } from "../../services/users.service";
import { ModalAlertService } from "../../services/modal-alert.service";
import { Subscription } from "rxjs";
import { ReplyComponent } from "../../modals/reply/reply.component";
import { ChatService } from "../../services/chat.service";
import { User } from "../../models/User";
import { UtilitiesService } from "../../services/utilities.service";
import { FilePreviewComponent } from "../../modals/file-preview/file-preview.component";
import { HttpClient } from "@angular/common/http";
import { FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.component.html",
  styleUrls: ["./post-detail.component.css"],
})
export class PostDetailComponent implements OnInit {
  @ViewChildren("commentsBox") commentsBox: QueryList<ElementRef>;

  subscriptionsArray: Subscription[] = [];

  allLastPosts: Post[] = [];
  comentForm: FormGroup;
  currentPostId: string;
  filterVariable: string = "-date";
  filteredLastPosts: Post[] = [];
  isLastPostsLoading: boolean = true;
  isPostLoading: boolean = true;
  isModalAlertRendered: boolean = false;
  login = "login";
  post: Post;
  postAnalytics: PostAnalytics;
  postAnalyticsReaction: string;
  modalAlertRef: any = null;
  postAuthor: User = null;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private location: Location,
    private http: HttpClient,
    private _alertModalS: ModalAlertService,
    public _chatS: ChatService,
    public _postsS: PostsService,
    public _postAnalyticsS: PostsAnalyticsService,
    public _usersS: UsersService,
    public _utilitiesS: UtilitiesService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.currentPostId = params["id"];
      if (this.currentPostId !== "new") {
        // Load Current Post Data
        this.loadPost(this.currentPostId);
        // Get PostAnalytics Subscription
        this._postAnalyticsS
          .getOnePostAnalytics(this.currentPostId)
          .subscribe();
        // Reload Last Posts List
        this.reloadfilteredLastPosts(this.currentPostId);
      }
    });
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
    this.initRegisterForm();
    this.filteredLastPostsFc();

    // Get Post Analytics Data Subscription
    this.subscriptionsArray.push(
      this._postAnalyticsS
        .getOneReturnedPostAnalytics()
        .subscribe(([postAnalyticsData, postAnalyticsReaction]) => {
          this.postAnalytics = postAnalyticsData;
          this.postAnalyticsReaction = postAnalyticsReaction;
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

  ngAfterViewInit(): void {
    this.subscriptionsArray.push(
      this.commentsBox.changes.subscribe(() => {
        if (this.commentsBox.toArray().length > 0)
          if (history.state.comments)
            // Scroll To Comments Section
            this.commentsBox.toArray().map((commentBox) => {
              commentBox.nativeElement.scrollIntoView({
                behavior: "auto",
                block: "start",
                inline: "nearest",
              });
            });
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  downloadFile(url: any) {
    const fileToDownload = url.substr(url.lastIndexOf("/") + 1);
    this.http
      .get(url, { responseType: "blob" as "json" })
      .subscribe((res: any) => {
        const file = new Blob([res], { type: res.type });

        // IE
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }

        const blob = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = blob;
        link.download = fileToDownload;

        // Version link.click() to work at firefox
        link.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );

        setTimeout(() => {
          // firefox
          window.URL.revokeObjectURL(blob);
          link.remove();
        }, 100);
      });
  }

  // Load Last 10 Articles
  filteredLastPostsFc() {
    this.subscriptionsArray.push(
      this._postsS.getPosts(true, 0, 10).subscribe((resp) => {
        this.allLastPosts = resp.docs;
        resp.docs.filter((post) => {
          this.filteredLastPosts =
            post._id !== this.currentPostId
              ? [...this.filteredLastPosts, post]
              : [...this.filteredLastPosts];
          this.isLastPostsLoading = false;
        });
      })
    );
  }

  // Return to Previous Page
  goBack(): void {
    this.location.back();
  }

  // Hide Comment Buttons When Comment Input Text is Focused
  hideCommentButtons() {
    $("#comment").val("");
    $(".comment-label").removeClass("active");
    $(".comment-buttons").removeClass("comment-buttons-show");
    $(".comment-buttons").addClass("comment-buttons-hide");
  }

  private async initRegisterForm() {
    this.comentForm = new FormGroup({
      comment: new FormControl(null, Validators.required),
    });
  }

  // Load Current Article Info
  loadPost(id: any) {
    this.subscriptionsArray.push(
      this._postsS.getPost(id).subscribe((post: any) => {
        this.post = post;
        this.postAuthor = post.user;
        this.isPostLoading = false;
      })
    );
  }

  // Toogle Chat Window
  openChat(lawyerData: any) {
    this._chatS.setLawyerRoomData(lawyerData);
    this._chatS.openChat();
  }

  // Open File Preview Modal
  openFileViewModal(path: string, name: string) {
    this._utilitiesS.openFileViewModal(path, name, FilePreviewComponent);
  }

  // Open Lawyer Contact Modal
  openLawyerContactModal() {
    let dialogRef = this.dialog.open(LawyerContactComponent, {
      autoFocus: false,
      disableClose: true,
    });
  }

  // Open Email Contact Modal
  openReplyModal(user?: any) {
    let dialogRef = this.dialog.open(ReplyComponent, {
      data: { user, action: "Nuevo" },
      autoFocus: false,
      disableClose: true,
    });
  }

  // Reload Last Posts Array After One Of Them Had Been Clicked
  reloadfilteredLastPosts(postId: string) {
    this.filteredLastPosts = [];
    this.allLastPosts.filter((post) => {
      this.filteredLastPosts =
        post._id !== postId
          ? [...this.filteredLastPosts, post]
          : [...this.filteredLastPosts];
    });
  }

  sendComment() {
    const commentData = {
      user: this._usersS.user._id,
      comment: this.comentForm.value.comment,
    };

    const commentPostSub = this._postAnalyticsS
      .postComment(this.currentPostId, commentData)
      .subscribe((resp) => {
        this.comentForm.reset();
        this.hideCommentButtons();
        this.postAnalytics = resp;
        commentPostSub.unsubscribe();
      });
  }

  // Show Comment Buttons When Comment Input Text is Focused
  showCommentButtons() {
    if ($(".comment-buttons").hasClass("comment-buttons-hide")) {
      $(".comment-buttons").removeClass("comment-buttons-hide");
    }
    $(".comment-buttons").addClass("comment-buttons-show");
  }

  // Show Modal Alert When The User Who Is Reacting Is Not Logged In
  showAlertModal(action: string, event: any, fileName?: any) {
    this._utilitiesS.showAlertModal(
      action,
      this._alertModalS,
      this.isModalAlertRendered,
      event,
      fileName
    );
  }

  // Like / Dislike Article
  updatePostReactions(reaction: string) {
    this.subscriptionsArray.push(
      this._postAnalyticsS
        .updatePostAnalytics(this.currentPostId, reaction)
        .subscribe()
    );
  }
}
