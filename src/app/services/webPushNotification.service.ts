import { Injectable } from '@angular/core';
import { Contacto } from '../models/Contacto';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Whatsapp } from '../models/Whatsapp';
import { NotificationsPagination } from '../models/Notification';
import { WebSocketService } from './webSocket.service';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class WebPushNotificationService {

  notifications: NotificationsPagination;

  constructor(
    private http: HttpClient,
    public _webSocketS: WebSocketService,
    public _userS: UsuariosService
  ) {
    this.loadStorage()
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

    const url = `${environment.URI}/api/notification`;

    this._webSocketS.emitEvt("notification", body);
    
    return this.http.post(url, sub, { headers }).pipe(
        catchError(this.handleError)
    );
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
    }/api/notification?status=${status}&page=${page + 1}&perPage=${perPage}`;

    if (orderField && orderType) {
      url = `${url}&orderField=${orderField}&orderType=${orderType}`;
    }

    if (filterOpt) {
      url = `${url}&filterOpt=${filterOpt}`;
    }

    if (filter) {
      url = `${url}&filter=${filter}`;
    }

    return this.http.get<NotificationsPagination>(url).pipe(
      map((resp: any) => {
        this.saveStorage(resp.notifications)
        return resp.notifications;
      })
    );
  }

  public getNotifications() {
    return this._webSocketS.listenEvt("new-notification");
  }

  handleError(error) {
    return throwError(error.error.message);
  }

  loadStorage() {
    if (localStorage.getItem('token')) {
      this.notifications = JSON.parse(localStorage.getItem('notifications'));
    } else {
      this.notifications = null;
      localStorage.removeItem('notifications');
    }
  }

  saveStorage(notifications: NotificationsPagination) {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }
}
