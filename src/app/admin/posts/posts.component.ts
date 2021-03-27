import { Component, OnInit, HostListener } from "@angular/core";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";

import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";
import { UpdateDataService } from "../../services/updateData.service";
import { PostsFormComponent } from "../../modals/posts-form/posts-form.component";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Subscription } from "rxjs";
import { WebPushNotificationsService } from "../../services/webPushNotifications.service";
import { UsersService } from "../../services/users.service";
import { CloudinaryService } from "../../services/cloudinary.service";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"],
})
export class PostsComponent implements OnInit {
  constructor(
    public _cloudinaryS: CloudinaryService,
    private _postsS: PostsService,
    public _updateDS: UpdateDataService,
    public _usersS: UsersService,
    public dialog: MatDialog,
    public _webPushNotificationsS: WebPushNotificationsService
  ) {}

  subscriptionsArray: Subscription[] = [];

  currentPage: number = 1;
  entriesFilter: any[] = [5, 10, 20, 50, 100, 200];
  filterValue: string;
  posts: Array<Post> = [];
  selectedEntry: number = 10;

  public innerScreenWidth: any;
  public mobileFilterActivated: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerScreenWidth = window.innerWidth;
    if (this.innerScreenWidth > 520) {
      this.mobileFilterActivated = false;
    }
  }

  ngOnInit() {
    // Get Screen Size
    this.innerScreenWidth = window.innerWidth;

    // List Posts By Lawyer Rol
    this.subscriptionsArray.push(
      this._postsS.getPostsByRol(this._usersS.user).subscribe((resp) => {
        this.posts = resp.docs;
      })
    );

    this.subscriptionsArray.push(
      this._postsS.notifica.subscribe(() => {
        this.load();
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Change Current Pagination Page
  changeEntry($event) {
    this.selectedEntry = $event;
    this.currentPage = 1;
  }

  // Delete Post
  delete(post: Post) {
    Swal.fire({
      icon: "warning",
      title: "¿Estas seguro?",
      text: "Estas a punto de borrar el artículo " + post.postTitle,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.subscriptionsArray.push(
          this._postsS.deletePost(post._id).subscribe(() => {
            this.load();
          })
        );
      }
    });
  }

  // Filter Posts By Condition
  filter(value: string) {
    if (value.length >= 1 && value !== "") this.filterValue = value;
    else this.filterValue = "";
  }

  getPostState(state: string): string {
    let processState: string = null;
    switch (state) {
      case "PUBLISH":
        processState = "Publicado";
        break;
      case "REJECT":
        processState = "Rechazado";
        break;
      default:
        processState = "En Revisión";
        break;
    }

    return processState;
  }

  // Handle Mobile Filter
  handleMobileFilter(flag: any) {
    if (this.innerScreenWidth <= 520) {
      this.mobileFilterActivated = flag;
    }
  }

  // List Posts By Lawyer Rol
  load() {
    this.subscriptionsArray.push(
      this._postsS.getPostsByRol(this._usersS.user).subscribe((resp) => {
        this.posts = resp.docs;
      })
    );
  }

  // Avoid to Open Accordion on Create Button
  moveDown(event: any) {
    event.stopPropagation();
  }

  // Open Posts Modal
  openPostsModal(postData?: any) {
    let dialogRef =
      postData && postData !== ""
        ? this.dialog.open(PostsFormComponent, {
            id: "postsModal",
            panelClass: "postsModal",
            height: "90%",
            data: { postData, action: "Editar" },
            autoFocus: false,
          })
        : this.dialog.open(PostsFormComponent, {
            id: "postsModal",
            panelClass: "postsModal",
            height: "90%",
            data: { action: "Escribir" },
            autoFocus: false,
          });

    dialogRef.afterClosed().subscribe(() => {
      this._cloudinaryS.uploader.clearQueue();
      this._cloudinaryS.cloudinaryItemsToDeleteArray = [];
      this._cloudinaryS.resetUploaderArrays();
    });
  }

  // Send Post Id
  sendId(id: string, action: string) {
    this._updateDS.sendArticleId(id, action);
  }

  updatePostState(idPost: any, processState: string) {
    this.subscriptionsArray.push(
      this._postsS.updatePostState(idPost, processState).subscribe((post) => {
        this._postsS.notifica.emit({ render: true });

        if (post.processState === "PUBLISH") {
          // Set Notification Data
          this._webPushNotificationsS
            .createNotificationObject(
              null,
              post._id,
              "publicó un nuevo artículo. " + post.title,
              "post",
              `articulos`,
              post.user._id,
              post.user.firstName
                .split(" ")[0]
                .concat(" ", post.user.lastName.split(" ")[0]),
              post.user.role,
              null,
              ["ALL"]
            )
            .then((notificationObject) => {
              // Create Notification With The Specified Data
              const notificationCreatedSub = this._webPushNotificationsS
                .createNotification(notificationObject)
                .subscribe(() => {
                  notificationCreatedSub.unsubscribe();
                });
            });
        }
      })
    );
  }
}
