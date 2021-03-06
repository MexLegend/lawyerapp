import { Component, OnInit, HostListener } from "@angular/core";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";

import { LawyerContactComponent } from "src/app/modals/lawyer-contact/lawyer-contact.component";
import { PostAnalytics } from "src/app/models/PostAnalytics";
import { PostsAnalyticsService } from "src/app/services/posts-analytics.service";

import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";
import Swal from "sweetalert2";
import { UsersService } from "../../services/users.service";
import { ModalAlertService } from "../../services/modal-alert.service";
import { Subscription } from "rxjs";
import { ReplyComponent } from "../../modals/reply/reply.component";
import { ChatService } from "../../services/chat.service";
import { User } from "../../models/User";
import { UtilitiesService } from "../../services/utilities.service";

declare var $: any;

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.component.html",
  styleUrls: ["./post-detail.component.css"],
})
export class PostDetailComponent implements OnInit {
  subscriptionsArray: Subscription[] = [];

  allLastPosts: Post[] = [];
  currentPostId: string;
  filteredLastPosts: Post[] = [];
  isModalAlertRendered: boolean = false;
  login = "login";
  post: Post;
  postAnalytics: PostAnalytics;
  postAnalyticsReaction: string;
  modalAlertRef: any = null;
  postAuthor: User = null;

  constructor(
    public activatedRoute: ActivatedRoute,
    public _chatS: ChatService,
    public dialog: MatDialog,
    private _alertModalS: ModalAlertService,
    private location: Location,
    public _usersS: UsersService,
    public _postsS: PostsService,
    public _postAnalyticsS: PostsAnalyticsService,
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

    $(document).ready(function () {
      // Hide Comment Buttons When Cancel Button is Clicked
      $(document).on("click", ".cancel-comment", function () {
        $("#comment").val("");
        $(".comment-label").removeClass("active");
        $(".send-comment").prop("disabled", true);
        $(".comment-buttons").removeClass("comment-buttons-show");
        $(".comment-buttons").addClass("comment-buttons-hide");
      });
      // Enable Comment Button When Text Input is Not Empty
      $(document).on("keyup", "#comment", function () {
        if ($(this).val() !== "") {
          $(".send-comment").prop("disabled", false);
        } else {
          $(".send-comment").prop("disabled", true);
        }
      });
    });
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Load Last 10 Articles
  filteredLastPostsFc() {
    this.subscriptionsArray.push(
      this._postsS.getPosts(true, 0, 10, "created_at", -1).subscribe((resp) => {
        this.allLastPosts = resp.docs;
        resp.docs.filter((post) => {
          this.filteredLastPosts =
            post._id !== this.currentPostId
              ? [...this.filteredLastPosts, post]
              : [...this.filteredLastPosts];
        });
      })
    );
  }

  // Return to Previous Page
  goBack(): void {
    this.location.back();
  }

  // Load Current Article Info
  loadPost(id: any) {
    this.subscriptionsArray.push(
      this._postsS.getPost(id).subscribe((post: any) => {
        this.post = post;
        this.postAuthor = post.user;
      })
    );
  }

  // Toogle Chat Window
  openChat(lawyerData: any) {
    this._chatS.setLawyerRoomData(lawyerData);
    this._chatS.openChat();
  }

  // Open Lawyer Contact Modal
  openLawyerContactModal() {
    let dialogRef = this.dialog.open(LawyerContactComponent, {
      autoFocus: false,
    });
  }

  // Open Users Modal
  openReplyModal(user?: any) {
    let dialogRef = this.dialog.open(ReplyComponent, {
      data: { user, action: "Nuevo" },
      autoFocus: false,
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

  // Show Comment Buttons When Comment Input Text is Focused
  showCommentButtons() {
    if ($(".comment-buttons").hasClass("comment-buttons-hide")) {
      $(".comment-buttons").removeClass("comment-buttons-hide");
    }
    $(".comment-buttons").addClass("comment-buttons-show");
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

  // Like / Dislike Article
  updatePostReactions(reaction: string) {
    this.subscriptionsArray.push(
      this._postAnalyticsS
        .updatePostAnalytics(this.currentPostId, reaction)
        .subscribe()
    );
  }
}
