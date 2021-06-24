import { Component, OnInit, HostListener } from "@angular/core";
import { UsersService } from "./services/users.service";
import { WebPushNotificationsService } from "./services/webPushNotifications.service";
import { Subscription } from "rxjs";
import { ChatService } from "./services/chat.service";
import { LocalStorageService } from "./services/local-storage.service";
import { MatDialog } from "@angular/material/dialog";
import { TawkService } from "./services/tawk.service";
import { ResolveEnd, Router } from "@angular/router";
import { UtilitiesService } from "./services/utilities.service";
import { MatSelect } from "@angular/material";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private _chatS: ChatService,
    private dialogRef: MatDialog,
    private _localStorageS: LocalStorageService,
    private router: Router,
    private TawkService: TawkService,
    private _usersS: UsersService,
    private _utilitiesS: UtilitiesService,
    private _webPushNotificationsS: WebPushNotificationsService
  ) {
    this.initSocketConnections();
    this._usersS.loadStorage();
  }

  subscriptionsArray: Subscription[] = [];
  modalExpanded: boolean = false;

  // Detect Real Screen Size
  @HostListener("window:resize", ["$event"])
  onResize() {
    this.resizeModal(this.modalExpanded);
  }

  ngOnInit() {
    this.subscriptionsArray.push(
      this.dialogRef.afterOpened.subscribe(async (ref) => {
        this.modalExpanded = ref.componentInstance.practiceAreaData?.notExpand;
        this.resizeModal(ref.componentInstance.practiceAreaData?.notExpand);

        const body = document.querySelector("html");

        if (body) body.style.overflow = "hidden";

        this.subscriptionsArray.push(
          ref.beforeClosed().subscribe(async () => {
            if (body) body.style.overflow = "";
            if (this._utilitiesS.showSocialMedia(this.router.url)) {
              this.TawkService.SetChatVisibility(true);
            } else {
              this.TawkService.SetChatVisibility(false);
            }
          })
        );
      })
    );

    this.subscriptionsArray.push(
      this.router.events.subscribe((routerData) => {
        if (routerData instanceof ResolveEnd)
          if (this._utilitiesS.showSocialMedia(routerData.url)) {
            this.TawkService.SetChatVisibility(true);
          } else {
            this.TawkService.SetChatVisibility(false);
          }
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  resizeModal(modalExpand?: boolean) {
    const modals = document.querySelectorAll(".mat-dialog-container");
    const { height, isMobile } = this._utilitiesS.getScreenSize();

    if (modals.length > 0) {
      modals.forEach((modalElement: any) => {
        if (isMobile) {
          this.TawkService.SetChatVisibility(false);
          if (!modalExpand)
            modalElement.style = `height: ${height}px !important;`;
        } else {
          this.TawkService.SetChatVisibility(true);
          if (!modalExpand) modalElement.style.height = "100%";
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
                const { creator_id, image, name, members, _id } =
                  messageData.roomData;
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
