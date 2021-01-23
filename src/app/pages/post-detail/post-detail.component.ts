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
import { ReplyComponent } from '../../modals/reply/reply.component';
import { User } from '../../models/User';
import { ChatService } from '../../services/chat.service';

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
  isPostReactionAlertRendered: boolean = false;
  login = "login";
  post: Post;
  postAnalytics: PostAnalytics;
  postAnalyticsReaction: string;
  postReactionAlertModalRef: any = null;

  constructor(
    public activatedRoute: ActivatedRoute,
    public _chatS: ChatService,
    public dialog: MatDialog,
    private _alertModalS: ModalAlertService,
    private location: Location,
    public _usersS: UsersService,
    public _postsS: PostsService,
    public _postAnalyticsS: PostsAnalyticsService
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

  // Close Post reaction Alert Modal When Clics Outside
  @HostListener("document:click", ["$event"])
  onGlobalClick(event: any): void {
    if (
      this.isPostReactionAlertRendered &&
      !event.target.closest(".postReactionModal")
    ) {
      this.postReactionAlertModalRef.close();
      this.isPostReactionAlertRendered = false;
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

    // Get Alert Modal Subscription
    this.subscriptionsArray.push(
      this._alertModalS.getModalAlertRef().subscribe((modalRef) => {
        this.postReactionAlertModalRef = modalRef;
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
      this._postsS.getPost(id).subscribe((post) => {
        this.post = post;
      })
    );
  }

  // Toogle Chat Window
  openChat(lawyerData: User) {
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
  showAlertModal(action: string) {
    let title: string = null;

    switch (action) {
      case "like":
        title = "¿Te gusta este artículo?";
        break;

      default:
        title = "¿No te gusta este artículo?";
        break;
    }

    if (!this.isPostReactionAlertRendered) {
      Swal.fire({
        customClass: { container: "postReactionModal" },
        title: title,
        text: "Inicia sesión para hacer que tu opinión cuente.",
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonColor: "#1e88e5",
        confirmButtonText: "Iniciar sesión",
        backdrop: false,
        allowOutsideClick: false,
        onOpen: () => {
          this.isPostReactionAlertRendered = true;
          this._alertModalS.setModalAlertRef(Swal);
        },
        onClose: () => (this.isPostReactionAlertRendered = false),
      }).then((result) => {
        if (result.value) {
          this.showLoginModal();
        }
      });
    }
  }

  // Trigger Login Modal When Is Not Logged In
  showLoginModal() {
    $("#modalRegistro").modal("open");
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
