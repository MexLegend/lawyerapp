import { Component, OnInit, Input } from "@angular/core";
import { WebPushNotificationsService } from "../../services/webPushNotifications.service";
import { Subscription } from "rxjs";
import { UsersService } from "../../services/users.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-notifications-dropdown",
  templateUrl: "./notifications-dropdown.component.html",
  styleUrls: ["./notifications-dropdown.component.css"],
})
export class NotificationsDropdownComponent implements OnInit {
  constructor(
    private router: Router,
    public _usersS: UsersService,
    public _webPushNotificationsS: WebPushNotificationsService
  ) {}

  @Input() public color: boolean;

  subscriptionsArray: Subscription[] = [];

  isLoading: boolean = true;
  notificationsArray: any = [];

  ngOnInit() {
    // Validate If Current User Is Logged In And Then Subscribe To Get Notifications Method
    if (this._usersS.isLogged()) {
      this.subscriptionsArray.push(
        this._webPushNotificationsS
          .getNotifications(this._usersS.user._id, this._usersS.user.role)
          .subscribe()
      );
    }

    // Reload Notifications List After Web Socket Emmits
    this.subscriptionsArray.push(
      this._webPushNotificationsS
        .getNotificationsSub()
        .subscribe((notifications) => {
          if (notifications.length > 0) {
            notifications.map((notification) => [
              (this.notificationsArray = [
                notification,
                ...this.notificationsArray,
              ]),
            ]);
          } else {
            this.notificationsArray;
          }
          this.isLoading = false;
        })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  //
  getNotificationAuthorRole(role: string): string {
    let authorRole: string = "";
    switch (role) {
      case "ADMIN":
        authorRole = "El Lic.";
        break;
      case "ASSOCIATED":
        authorRole = "El Lic.";
        break;
      case "CLIENT":
        authorRole = "El cliente";
        break;

      default:
        authorRole = "El usuario";
        break;
    }

    return authorRole;
  }

  // Navigate To Url Path
  navigateToUrl(url: any) {
    this.router.navigateByUrl(url);
  }
}
