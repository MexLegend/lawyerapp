import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { NotificationsPagination } from "../models/Notification";
import { UsersService } from "./users.service";
import { NotificationsService } from "src/app/services/notifications.service";
import { Socket } from "ngx-socket-io";
import { User } from "../models/User";

@Injectable({
  providedIn: "root",
})
export class WebPushNotificationsService {
  notifications: NotificationsPagination;

  constructor(
    private http: HttpClient,
    public _notificationsS: NotificationsService,
    private socket: Socket,
    public _usersS: UsersService
  ) {
    this.checkSocketStatus();
  }

  private notificationsArray = new Subject<any>();

  public socketStatus: boolean = false;

  checkSocketStatus() {
    this.socket.on("connect", () => {
      console.log("Conectado al servidor");
      this.socketStatus = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
      this.socketStatus = false;
    });
  }

  createNotification(notification: any): Observable<any> {
    const url = `${environment.URI}/api/notifications`;
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    return this.http.post(url, notification, { headers }).pipe(
      map((resp: any) => resp),
      catchError((err) => {
        this._notificationsS.message(
          "error",
          "Creación fallida",
          err.error.message,
          false,
          false,
          "",
          "",
          2000
        );
        return throwError(err);
      })
    );
  }

  async createNotificationObject(
    image_user: string,
    image_post: string,
    title: string,
    type: string,
    url_path: string,
    user_actor: string,
    user_actor_name: string,
    user_actor_role: string,
    user_receiver: string,
    allowed_roles?: string[]
  ): Promise<any> {
    const notificationObject = {
      image_user,
      image_post,
      title,
      type,
      url_path,
      user_actor,
      user_actor_name,
      user_actor_role,
      user_receiver,
      allowed_roles,
    };

    return await new Promise((resolve, reject) => resolve(notificationObject));
  }

  emitToSocket(event: string, data: any, callback?: Function) {
    this.socket.emit(event, data, callback);
  }

  getNotifications(idUser: string, roleUser: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    const url = `${environment.URI}/api/notifications/userNotifications/${idUser}/${roleUser}`;

    return this.http
      .get(url, { headers })
      .pipe(
        map((resp: any) =>
          this.isSameNotificationUser(
            this.reorderNotificationData(resp.notification)
          )
        )
      );
  }

  listenFromSocket(event: string): Observable<any> {
    return this.socket.fromEvent(event);
  }

  loginSocket(user: User, rooms: any) {
    this.emitToSocket("config-user", { user, rooms });
  }

  getNotificationsSub(): Observable<any> {
    return this.notificationsArray.asObservable();
  }

  setNotificationsSub(notifications: any) {
    this.notificationsArray.next(notifications);
  }

  // Normal Functions

  isSameNotificationUser(notificationsArray: any) {
    const userNotifications = notificationsArray.filter((notificationData) => {
      if (notificationData.user_receiver) {
        return notificationData.user_receiver === this._usersS.user._id;
      } else {
        return notificationData.allowed_roles.find((role: any) =>
          role === "ALL" &&
          notificationData.user_actor_id !== this._usersS.user._id
            ? true
            : role === this._usersS.user.role
            ? notificationData
            : null
        );
      }
    });

    this.setNotificationsSub(userNotifications);
  }

  getNotificationActorName(firstName: string, lastName: string): string {
    const userName = firstName
      .split(" ")[0]
      .concat(" ", lastName.split(" ")[0]);

    return userName;
  }

  getNotificationImage(type: string, userData: any, postData: any): string {
    return type !== "post" ? userData.img : postData.img;
  }

  getNotificationObject(notificationData): any {
    let notificationObject: any[] = [];

    notificationData.map((notification) => {
      notificationObject = [
        ...notificationObject,
        {
          allowed_roles: notification.allowed_roles,
          is_viewed: false,
          users_viewed: notification.users_viewed,
          show_buttons: notification.show_buttons,
          image: this.getNotificationImage(
            notification.type,
            notification.image_user,
            notification.image_post
          ),
          title: notification.title,
          type: notification.type,
          url_path: notification.url_path,
          user_actor: notification.user_actor,
          user_actor_role: notification.user_actor_role,
          created_at: notification.created_at,
          user_receiver: notification.user_receiver,
        },
      ];
    });

    return notificationObject;
  }

  reorderNotificationData(notificationData): any {
    let reorderedNotificationData: any[] = [];

    notificationData.map((notification) => {
      reorderedNotificationData = [
        ...reorderedNotificationData,
        {
          allowed_roles: notification.allowed_roles,
          is_viewed: notification.is_viewed,
          users_viewed: notification.users_viewed,
          show_buttons: notification.notification_id.show_buttons,
          element_id: notification.notification_id.element_id,
          image: this.getNotificationImage(
            notification.notification_id.type,
            notification.notification_id.image_user,
            notification.notification_id.image_post
          ),
          title: notification.notification_id.title,
          type: notification.notification_id.type,
          url_path: notification.notification_id.url_path,
          user_actor_id: notification.notification_id.user_actor._id,
          user_actor: this.getNotificationActorName(
            notification.notification_id.user_actor.firstName,
            notification.notification_id.user_actor.lastName
          ),
          user_actor_role: notification.notification_id.user_actor_role,
          created_at: notification.notification_id.created_at,
          user_receiver: notification.user_receiver,
        },
      ];
    });

    return reorderedNotificationData;
  }

  sendNotification(notificationData?: any) {
    //   Push.create("Haizen - Abogados", {
    //     body: `El Lic`,
    //     icon: "",
    //     timeout: 4000,
    //     onClick: function () {
    //       window.focus();
    //       this.close();
    //     },
    //     onError() {
    //       console.log("No se puedo ejecutar la acción");
    //     },
    //   });
  }
}
