import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { UsersService } from "./services/users.service";
import { WebPushNotificationsService } from "./services/webPushNotifications.service";
import { Subscription } from "rxjs";
import { ChatService } from "./services/chat.service";
import { LocalStorageService } from "./services/local-storage.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private _chatS: ChatService,
    private _localStorageS: LocalStorageService,
    private _usersS: UsersService,
    private _webPushNotificationsS: WebPushNotificationsService
  ) {
    this.cookieService.set("Lawyerapp", "Hello World", null, null, null);

    this.initSocketConnections();
    this._usersS.loadStorage();
  }

  subscriptionsArray: Subscription[] = [];

  ngOnInit() {}

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
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
              this._webPushNotificationsS.setNotificationsSub([
                notificationData,
              ]);
              this._webPushNotificationsS.sendNotification(notificationData);
            })
        );

        // Get Group Socket Notifications
        this.subscriptionsArray.push(
          this._webPushNotificationsS
            .listenFromSocket("get-group-socket-event-notification")
            .subscribe((notificationData) => {
              this._webPushNotificationsS.setNotificationsSub([
                notificationData,
              ]);
              this._webPushNotificationsS.sendNotification(notificationData);
            })
        );

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
              this._webPushNotificationsS.setNotificationsSub([
                notificationData,
              ]);
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
