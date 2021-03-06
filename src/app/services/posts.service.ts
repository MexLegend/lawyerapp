import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable, throwError, Subject } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Post, PostsPagination } from "../models/Post";
import { NotificationsService } from "./notifications.service";
import { UsersService } from "./users.service";
import { User } from "../models/User";

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class PostsService {
  public notifica = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    public _notificationsS: NotificationsService,
    private _usersS: UsersService
  ) {}

  createPost(postDataObtained: any, postImage?: any): Observable<any> {
    const url = `${environment.URI}/api/posts`;
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    const { _id: id, ...postData } = postDataObtained;

    const data = {
      postData: { ...postData, user: this._usersS.user._id },
      postImage,
      processState: "REVIEWING",
    };

    console.log(data);

    return this.http.post<Post>(url, data, { headers }).pipe(
      map((resp: any) => {
        this._notificationsS.message(
          "success",
          "Creación correcta",
          resp.message,
          false,
          false,
          "",
          "",
          2000
        );
        return resp;
      }),
      catchError((err) => {
        this._notificationsS.message(
          "error",
          "Creación fallida",
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

  deletePost(id: string): Observable<Post> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/posts/${id}`;

    return this.http.delete<Post>(url, { headers }).pipe(
      map((resp: any) => {
        this._notificationsS.message(
          "success",
          "Eliminación correcta",
          resp.message,
          false,
          false,
          "",
          "",
          2000
        );
        return resp;
      })
    );
  }

  getPost(id: string): Observable<Post> {
    const url = `${environment.URI}/api/posts/${id}`;
    return this.http.get<Post>(url).pipe(map((resp: any) => resp.post));
  }

  getPosts(
    processState?: boolean,
    page: number = 0,
    perPage: number = 10,
    status: boolean = true
  ): Observable<PostsPagination> {
    let url = `${environment.URI}/api/posts?status=${status}&page=${
      page + 1
    }&perPage=${perPage}`;

    if (processState) {
      url = `${url}&processState=${processState}`;
    }

    return this.http
      .get<PostsPagination>(url)
      .pipe(map((resp: any) => resp.posts));
  }

  getPostsByLawyer(
    lawyerId: string,
    page: number = 0,
    perPage: number = 10,
    status: boolean = true
  ): Observable<PostsPagination> {
    let url = `${environment.URI}/api/posts/byLawyer/?status=${status}&page=${
      page + 1
    }&perPage=${perPage}&lawyerId=${lawyerId}`;

    return this.http
      .get<PostsPagination>(url)
      .pipe(map((resp: any) => resp.posts));
  }

  getPostsByRol(
    user: User,
    page: number = 0,
    perPage: number = 10,
    status: boolean = true
  ): Observable<PostsPagination> {
    let url = `${environment.URI}/api/posts/byRol/?status=${status}&page=${
      page + 1
    }&perPage=${perPage}&user=${encodeURIComponent(JSON.stringify(user))}`;

    return this.http
      .get<PostsPagination>(url)
      .pipe(map((resp: any) => resp.posts));
  }

  async getPostsCount(
    postsArray: Post[],
    initialPostsCount: any
  ): Promise<any> {
    let postsCount: any;

    postsArray.map((post: Post) => {
      switch (post.processState) {
        case "REVIEWING":
          postsCount = {
            ...initialPostsCount,
            reviewing: (initialPostsCount.reviewing += 1),
          };
          break;
        case "PUBLISH":
          postsCount = {
            ...initialPostsCount,
            publish: (initialPostsCount.publish += 1),
          };
          break;
        default:
          postsCount = {
            ...initialPostsCount,
            rejected: (initialPostsCount.rejected += 1),
          };
          break;
      }
    });

    return new Promise((resolve, reject) => resolve(postsCount));
  }

  updatePost(
    postDataObtained: any,
    postImage?: any,
    cloudinaryItemsArray?: Array<any>
  ) {
    const { _id: id, ...postData } = postDataObtained;

    const headers = new HttpHeaders({
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/posts/${id}`;

    const data = {
      postData,
      postImage,
      cloudinaryItemsArray,
    };

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        this._notificationsS.message(
          "success",
          "Actualización correcta",
          resp.message,
          false,
          false,
          "",
          "",
          2000
        );
        return true;
      }),
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

  updatePostState(id, processState: string) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/posts/updateState/${id}`;

    const data = { processState: processState };

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        this._notificationsS.message(
          "success",
          resp.message,
          "",
          false,
          false,
          "",
          "",
          2000
        );
        return resp.post;
      }),
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
