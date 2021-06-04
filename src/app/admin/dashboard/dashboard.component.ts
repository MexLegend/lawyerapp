import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ReplyComponent } from "../../modals/reply/reply.component";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { UsersService } from "../../services/users.service";
import { PostsService } from "../../services/posts.service";
import { CasesService } from "../../services/cases.service";
import { TrackingService } from "../../services/tracking.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private _casesS: CasesService,
    private _postsS: PostsService,
    private _usersS: UsersService
  ) {}

  subscriptionsArray: Subscription[] = [];

  public casesCount: any = { active: 0, archived: 0 };
  public postsCount: any = { reviewing: 0, publish: 0, rejected: 0 };
  public usersCount: any = { admin: 0, associated: 0, client: 0, new: 0 };

  public comments = [1, 2, 3, 4, 5, 6, 7, 8];
  public config: PerfectScrollbarConfigInterface = {};
  public type: string = "component";

  ngOnInit() {
    // Get Users Supcription
    this.subscriptionsArray.push(this._usersS.getUsers().subscribe());

    // Get Cases Supcription
    this.subscriptionsArray.push(this._casesS.getCases().subscribe());

    // List Users Subscription
    this.subscriptionsArray.push(
      this._usersS.getUsersList().subscribe((usersList) => {
        if (usersList.length > 0) {
          this._usersS
            .getUsersCount(usersList, this.usersCount)
            .then((obtainedUsersList) => {
              this.usersCount = obtainedUsersList;
            });
        } else {
          this.usersCount;
        }
      })
    );

    // List Posts Subscription
    this.subscriptionsArray.push(
      this._postsS.getPostsByRol(this._usersS.user).subscribe((resp) => {
        if (resp.docs.length > 0) {
          this._postsS
            .getPostsCount(resp.docs, this.postsCount)
            .then((obtainedPostsList) => {
              this.postsCount = obtainedPostsList;
            });
        } else {
          this.postsCount;
        }
      })
    );

    // List Cases Subscription
    this.subscriptionsArray.push(
      this._casesS.getCasesData().subscribe((cases) => {
        if (cases.docs.length > 0) {
          this._casesS
            .getCasesCount(cases.docs, this.casesCount)
            .then((obtainedCasesList) => {
              this.casesCount = obtainedCasesList;
            });
        } else {
          this.casesCount;
        }
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Open User Reply Modal
  openReplyModal(user?: any) {
    let dialogRef = this.dialog.open(ReplyComponent, {
      data: { user, action: "Editar" },
      autoFocus: false,
      disableClose: true
    });
  }
}
