import { Component, OnInit, HostListener } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { UsersService } from "./services/users.service";
import { WebPushNotificationsService } from "./services/webPushNotifications.service";
import { Subscription } from "rxjs";
import { ChatService } from "./services/chat.service";
import { LocalStorageService } from "./services/local-storage.service";
import { MatDialog } from "@angular/material/dialog";
import { TawkService } from "./services/tawk.service";
import { ResolveEnd, Router } from "@angular/router";
import { UtilitiesService } from "./services/utilities.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private _chatS: ChatService,
    private dialogRef: MatDialog,
    private _localStorageS: LocalStorageService,
    private router: Router,
    private TawkService: TawkService,
    private _usersS: UsersService,
    private _utilitiesS: UtilitiesService,
    private _webPushNotificationsS: WebPushNotificationsService
  ) {
    this.cookieService.set("Lawyerapp", "Hello World", null, null, null);

    this.initSocketConnections();
    this._usersS.loadStorage();
  }

  subscriptionsArray: Subscription[] = [];

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.resizeModal();
  }

  ngOnInit() {
    this.dialogRef.afterOpened.subscribe((ref) => {
      this.resizeModal();

      const body = document.querySelector("html");

      if (body) body.style.overflow = "hidden";

      ref.beforeClosed().subscribe(() => {
        if (body) body.style.overflow = "";
      });
    });

    this.router.events.subscribe((routerData) => {
      if (routerData instanceof ResolveEnd)
        if (this._utilitiesS.showSocialMedia(routerData.url)) {
          this.TawkService.SetChatVisibility(true);
        } else {
          this.TawkService.SetChatVisibility(false);
        }
    });
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  // Get Screen Width And Height Size
  getScreenSize(): { width: number; height: number } {
    const innerScreenWidth = window.innerWidth;
    const innerScreenHeight = window.innerHeight;

    return { width: innerScreenWidth, height: innerScreenHeight };
  }

  resizeModal() {
    const modal = document.querySelectorAll(
      ".mat-dialog-container, .cdk-overlay-container"
    );
    if (modal.length > 0) {
      modal.forEach((modalElement: any) => {
        if (this.getScreenSize().width < 768) {
          modalElement.style = `height: ${
            this.getScreenSize().height
          }px !important; max-height: ${
            this.getScreenSize().height
          }px !important`;
        } else {
          modalElement.style.height = "100%";
          modalElement.style.maxHeight = "100%";
        }
      });
    }
  }

  initSocketConnections() {
    // Validate If Current User Is Logged In And Then Listen To Web Sockets Emits
    this._usersS.getSocketConnection().subscribe((isClientLogged) => {
      if (isClientLogged) {
        this._webPushNotificationsS.loginSocket(
          this._usersS.user,
          this._usersS.rooms
        );

        // Get Public Socket Notifications
        this.subscriptionsArray.push(
          this._webPushNotificationsS
            .listenFromSocket("get-public-socket-event-notification")
            .subscribe((notificationData) => {
              this._webPushNotificationsS.setNotificationsSub(
                this._webPushNotificationsS.getNotificationObject([
                  notificationData,
                ])
              );
              this._webPushNotificationsS.sendNotification(notificationData);
            })
        );

        // Get Group Socket Notifications
        this.subscriptionsArray.push(
          this._webPushNotificationsS
            .listenFromSocket("get-group-socket-event-notification")
            .subscribe((notificationData) => {
              this._webPushNotificationsS.setNotificationsSub(
                this._webPushNotificationsS.getNotificationObject([
                  notificationData,
                ])
              );
              this._webPushNotificationsS.sendNotification(notificationData);
            })
        );

        // Chat Socket Events
        this.subscriptionsArray.push(
          this._webPushNotificationsS
            .listenFromSocket("get-group-message-event")
            .subscribe((messageData: any) => {
              // Validate If Message Event Is After Room Has Been Created
              if (messageData.roomData || messageData.chat) {
                // Update LocalStorage Rooms List
                this._localStorageS.pushElementToStorageProperty("rooms", {
                  _id: "new",
                  room: messageData.roomData._id,
                });
                // Update Rooms List
                this._chatS.setChatRoomsListSub([
                  {
                    chat_room_id: messageData.roomData,
                    messages: [messageData.messageData.messages[0]],
                  },
                ]);
                const {
                  creator_id,
                  image,
                  name,
                  members,
                  _id,
                } = messageData.roomData;
                // Update Current Room Data
                this._chatS.setChatRoomDataSub(
                  creator_id,
                  image,
                  name,
                  members,
                  _id
                );
              }
              // Update Room Messages List
              this._chatS.setChatRoomMessagesListSub(
                messageData.messageData,
                messageData.messageData.chat_room_id._id,
                messageData.isCreating
              );

              // this._webPushNotificationsS.sendNotification();
            })
        );

        // Get Private Socket Notifications
        this.subscriptionsArray.push(
          this._webPushNotificationsS
            .listenFromSocket("get-private-socket-event-notification")
            .subscribe((notificationData) => {
              this._webPushNotificationsS.setNotificationsSub(
                this._webPushNotificationsS.getNotificationObject([
                  notificationData,
                ])
              );
              this._webPushNotificationsS.sendNotification(notificationData);
            })
        );
      } else {
        this.subscriptionsArray.map((subscription) =>
          subscription.unsubscribe()
        );
      }
    });
  }
}
