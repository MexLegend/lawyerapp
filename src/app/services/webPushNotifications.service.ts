import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { NotificationsPagination } from '../models/Notification';
import { UsersService } from './users.service';
import { WebSocketService } from './webSocket.service';

@Injectable({
  providedIn: 'root'
})
export class WebPushNotificationsService {

  notifications: NotificationsPagination;

  constructor(
    private http: HttpClient,
    public _userS: UsersService,
    public _webSocketS: WebSocketService
   ) {
    this.loadStorage()
  }

  get(
    page: number = 0,
    perPage: number = 10,
    orderField: string = "",
    orderType: string = "",
    filter: string = "",
    filterOpt: string = "title",
    status: boolean = true
  ): Observable<NotificationsPagination> {
    let url = `${ 
      environment.URI
     }/api/notifications?status=${ status }&page=${ page + 1 }&perPage=${ perPage }`;

    if ( orderField && orderType ) {
      url = `${ url }&orderField=${ orderField }&orderType=${ orderType }`;
    }

    if ( filterOpt ) {
      url = `${ url }&filterOpt=${ filterOpt }`;
    }

    if ( filter ) {
      url = `${ url }&filter=${ filter }`;
    }

    return this.http.get<NotificationsPagination>(url).pipe(
      map((resp: any) => {
        this.saveStorage(resp.notifications)

        return resp.notifications;
      })
    );
  }

  handleError(error ) {
    return throwError(error.error.message);
  }
  public getNotifications( ) {
    return this._webSocketS.listenEvt("new-notification");
  }

  loadStorage( ) {
    if ( localStorage.getItem('token') ) {
      this.notifications = JSON.parse(localStorage.getItem('notifications'));
    } else {
      this.notifications = null;
      localStorage.removeItem('notifications');
    }
  }

  postSubscription(sub: PushSubscription, name: string) {
    console.log(name);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._userS.token,
    });

    const body = {
      sub,
      name,
      typeU: this._userS.user.role
    }

    const url = `${ environment.URI }/api/notifications`;

    this._webSocketS.emitEvt("notification", body);

    return this.http.post(url, sub, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  saveStorage(notifications: NotificationsPagination ) {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }
}