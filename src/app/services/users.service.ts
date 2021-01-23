import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, throwError, Subject } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { NotificationsPagination } from "../models/Notification";
import { User, UsersPagination } from "../models/User";
import { NotificationsService } from "./notifications.service";
import { ThemeService, lightTheme } from "./theme.service";
import { CloudinaryService } from "./cloudinary.service";
import { LocalStorageService } from "./local-storage.service";

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public _cloudinaryS: CloudinaryService,
    public _localstorageS: LocalStorageService,
    public _notificationsS: NotificationsService,
    public _themeS: ThemeService
  ) {}

  public notifica = new EventEmitter<any>();
  socketConnection = new Subject<boolean>();
  usersList = new Subject<any>();

  id: string;
  notifications: NotificationsPagination;
  rooms: any;
  token: string = null;
  user: User = null;

  checkEmail(email: string) {
    const url = `${environment.URI}/api/users/check/email`;
    const body = {
      email,
    };

    return this.http.post(url, body).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  createUser(user: User, img?: any, lawyer?: any) {
    const url = `${environment.URI}/api/users`;

    let public_lawyer_id = this.generateKey();

    const data = {
      lawyer,
      user,
      img,
      public_lawyer_id,
    };

    return this.http.post(url, data).pipe(
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

  deleteUser(id: string): Observable<User> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this.token,
    });
    const url = `${environment.URI}/api/users/${id}`;

    return this.http
      .delete<User>(url, { headers })
      .pipe(
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

  isLogged() {
    if (this.token === undefined || this.token === null) {
      return;
    } else {
      return this.token.length > 5 ? true : false;
    }
  }

  generateKey() {
    // Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
    const allNumbers = [..."0123456789"];

    const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];

    const generator = (base: string[], len: number) => {
      return [...Array(len)]
        .map((i) => base[(Math.random() * base.length) | 0])
        .join("");
    };

    return generator(base, 10);
  }

  getLawyers(): Observable<User> {
    let url = `${environment.URI}/api/users/lawyers`;

    return this.http
      .get<UsersPagination>(url)
      .pipe(map((resp: any) => resp.lawyers));
  }

  async getUsersCount(
    usersArray: User[],
    initialUsersCount: any
  ): Promise<any> {
    let usersCount: any;

    usersArray.map((user: User) => {
      switch (user.role) {
        case "ADMIN":
          usersCount = {
            ...initialUsersCount,
            admin: (initialUsersCount.admin += 1),
          };
          break;
        case "ASSOCIATED":
          usersCount = {
            ...initialUsersCount,
            associated: (initialUsersCount.associated += 1),
          };
          break;
        case "CLIENT":
          usersCount = {
            ...initialUsersCount,
            client: (initialUsersCount.client += 1),
          };
          break;
        default:
          usersCount = {
            ...initialUsersCount,
            new: (initialUsersCount.new += 1),
          };
          break;
      }
    });

    return new Promise((resolve, reject) => resolve(usersCount));
  }

  getUsersList(): Observable<User[]> {
    return this.usersList.asObservable();
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUser(id: string): Observable<User> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this.token,
    });
    const url = `${environment.URI}/api/users/${id}`;

    return this.http
      .get<User>(url, { headers })
      .pipe(map((resp: any) => resp.user));
  }

  getCurrentUserName(): string {
    const userName = this.user.firstName
      .split(" ")[0]
      .concat(" ", this.user.lastName.split(" ")[0]);

    return userName;
  }

  getUsers(
    page: number = 0,
    perPage: number = 10,
    orderField: string = "",
    orderType: string = "",
    filter: string = "",
    filterOpt: string = "firstName",
    status: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this.token,
    });

    let url = `${environment.URI}/api/users?status=${status}&page=${
      page + 1
    }&perPage=${perPage}`;

    if (orderField && orderType) {
      url = `${url}&orderField=${orderField}&orderType=${orderType}`;
    }

    if (filterOpt) {
      url = `${url}&filterOpt=${filterOpt}`;
    }

    if (filter) {
      url = `${url}&filter=${filter}`;
    }

    return this.http
      .get<UsersPagination>(url, { headers })
      .pipe(map((resp: any) => this.setUsersList(resp.users.docs)));
  }

  getSocketConnection(): Observable<boolean> {
    return this.socketConnection.asObservable();
  }

  getUserRole(user: any, viewType: string): string {
    let role: string;

    if (this.isExteralClient(user)) {
      role = viewType === "update" ? "CLIENTE EXTERNO" : "Cliente Externo";
    } else {
      switch (user.role) {
        case "ADMIN":
          role = viewType === "update" ? "ADMINISTRADOR" : "Administrador";
          break;
        case "ASSOCIATED":
          role = viewType === "update" ? "ASOCIADO" : "Asociado";
          break;
        case "CLIENT":
          role = viewType === "update" ? "CLIENTE" : "Cliente";
          break;
        default:
          role = viewType === "update" ? "un usuario NUEVO" : "Nuevo";
          break;
      }
    }

    return role;
  }

  isExteralClient(user: any): boolean {
    const isExternalClient = user.lawyers.some(
      (lawyer: any) => lawyer.lawyer !== this.user._id && user.role === "CLIENT"
    );

    return isExternalClient;
  }

  loadStorage() {
    if (localStorage.getItem("token")) {
      this.id = localStorage.getItem("id");
      this.token = localStorage.getItem("token");
      this.user = JSON.parse(localStorage.getItem("user"));
      this.rooms = JSON.parse(localStorage.getItem("rooms"));
      this._themeS.setTheme(JSON.parse(localStorage.getItem("theme")));
      this.setSocketConnection(true);
    } else {
      this.id = "";
      this.rooms = null;
      this.token = "";
      this.user = null;
      this.notifications = null;
      localStorage.removeItem("notifications");
      this.setSocketConnection(false);
    }
  }

  login(user: User, remember: boolean = false): Observable<any> {
    // Init Socket Connection
    this.setSocketConnection(true);

    if (remember) {
      localStorage.setItem("email", user.email);
    } else {
      localStorage.removeItem("email");
    }

    const url = `${environment.URI}/api/login`;

    return this.http.post(url, user).pipe(
      map((resp: any) => {
        this.saveStorage(resp.user._id, resp.token, resp.user, resp.user.rooms);

        document.querySelector("body").style.overflow = "auto";

        // this._localstorageS
        //   .getLocalStoragePropertyIfExists(["lastVisitedPage"])
        //   .map((item) => {
        //     if (item) {
        //       if (
        //         JSON.parse(item.lastVisitedPage).includes("/articulo-detalle")
        //       ) {
        //         this._postAnalyticsS
        //         .getOnePostAnalytics(JSON.parse(item.lastVisitedPage).split("/").pop());
        //       } else {
        //         console.log(JSON.parse(item.lastVisitedPage));
        //       }
        //     }
        //   });
        // Load LocalStorage Theme If Exists
        if (localStorage.getItem("theme")) {
          this._themeS.setTheme(JSON.parse(localStorage.getItem("theme")));
        } else {
          localStorage.setItem("theme", JSON.stringify(lightTheme));
          localStorage.setItem("dark", "false");
        }
        return resp;
      }),
      catchError((err) => {
        this._notificationsS.message(
          "error",
          "Credenciales incorrectas",
          err.error.message,
          true,
          false,
          "",
          "Cerrar",
          4000
        );
        return throwError(err);
      })
    );
  }

  logout(lastVisitedPage?: any) {
    // Close Socket Connection
    this.setSocketConnection(false);

    this.user = null;
    this.id = null;
    this.token = null;

    // this._localstorageS.addLocalStorageItem("lastVisitedPage", lastVisitedPage);
    this._localstorageS.resetLocalStorage();
    this._themeS.resetDefaultTheme();

    document.querySelector("body").style.overflow = "auto";
    if ($(".sidenav-overlay").css("display", "block")) {
      $(".sidenav-overlay").css("display", "none");
    }

    this.router.navigate(["/inicio"]);
  }

  saveStorage(id: string, token: string, user: User, rooms?: any) {
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("rooms", JSON.stringify(rooms));

    this.id = id;
    this.user = user;
    this.token = token;
    this.rooms = rooms;
  }

  setUsersList(usersList: User[]) {
    this.usersList.next(usersList);
  }

  setSocketConnection(isLogged: boolean) {
    this.socketConnection.next(isLogged);
  }

  updateImage(id, img: any) {
    const url = `${environment.URI}/api/users/image/${id}`;
    const headers = new HttpHeaders({
      token: this.token,
    });

    return this.http.put(url, img, { headers }).pipe(
      map((resp: any) => {
        if (resp.user) {
          if (id === this.id) {
            this.saveStorage(resp.user._id, this.token, resp.user, this.rooms);
          }

          this._cloudinaryS.clearQueue();
        }

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

  updatePassword(id, user: any) {
    const url = `${environment.URI}/api/users/change-pass/${id}`;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this.token,
    });

    return this.http.put(url, user, { headers }).pipe(
      map((resp: any) => {
        if (resp.ok) {
          if (id === this.id) {
            this.saveStorage(resp.user._id, this.token, resp.user, this.rooms);
          }

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
        } else {
          this._notificationsS.message(
            "error",
            "Actualización fallida",
            resp.message,
            false,
            false,
            "",
            "",
            2000
          );
        }

        return resp;
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

  updateUser(id, user: any, img?: any) {
    const url = `${environment.URI}/api/users/${id}`;
    const headers = new HttpHeaders({
      token: this.token,
    });

    const data = img
      ? {
          user,
          img,
        }
      : {
          user,
        };

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        if (id === this.id) {
          this.saveStorage(resp.user._id, this.token, resp.user, this.rooms);
        }

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

        return resp;
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

  updateRol(id, rol: string) {
    const url = `${environment.URI}/api/users/rol/${id}`;
    const headers = new HttpHeaders({
      token: this.token,
    });

    const data = {
      rol,
    };

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => resp),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
