import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable, throwError, Subject } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { PostAnalytics } from "../models/PostAnalytics";
import { NotificationsService } from "./notifications.service";
import { UsersService } from "./users.service";

@Injectable({
  providedIn: "root",
})
export class PostsAnalyticsService {
  public notifica = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    public _notificationsS: NotificationsService,
    private _usersS: UsersService
  ) {}

  private allReturnedPostAnalytics = new Subject<any>();
  private singleReturnedPostAnalytics = new Subject<any>();

  // Observable Subscriptions

  // Get checked evidences after handler button clicked
  getOneReturnedPostAnalytics(): Observable<any> {
    return this.singleReturnedPostAnalytics;
  }

  // Set checked evidences after handler button clicked
  setOneReturnedPostAnalytics(
    postAnalyticsData: PostAnalytics,
    postAnalyticsReaction: string
  ) {
    this.singleReturnedPostAnalytics.next([
      postAnalyticsData,
      postAnalyticsReaction,
    ]);
  }

  // Get checked evidences after handler button clicked
  getAllReturnedPostAnalytics(): Observable<PostAnalytics> {
    return this.allReturnedPostAnalytics;
  }

  // Set checked evidences after handler button clicked
  setAllReturnedPostAnalytics(postAnalyticsData: PostAnalytics) {
    this.allReturnedPostAnalytics.next(postAnalyticsData);
  }

  // Appi CRUD Methods

  getOnePostAnalytics(id: string): Observable<any> {
    let parameter: any = id;

    if (this._usersS.id) {
      parameter = parameter + "-" + this._usersS.id;
    }

    let url = `${environment.URI}/api/postsanalytics/${parameter}`;

    return this.http
      .get(url)
      .pipe(
        map((resp: any) =>
          this.setOneReturnedPostAnalytics(
            resp.postAnalytics,
            resp.currentUserAnalyticsReaction
          )
        )
      );
  }

  getAllPostAnalytics(): Observable<any> {
    const url = `${environment.URI}/api/postsanalytics`;

    return this.http
      .get(url)
      .pipe(
        map((resp: any) => this.setAllReturnedPostAnalytics(resp.postAnalytics))
      );
  }

  updatePostAnalytics(idPost, reaction: string, userComment?: string) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    const url = `${environment.URI}/api/postsanalytics/update/${idPost}`;

    const data = {
      reaction: reaction ? reaction : null,
      comment: userComment ? userComment : null,
    };

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) =>
        this.setOneReturnedPostAnalytics(
          resp.updatedPostAnalytics,
          resp.reactions.reaction
        )
      ),
      catchError((err) => {
        this._notificationsS.message(
          "error",
          "Actualización fallida",
          err.message,
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
}
