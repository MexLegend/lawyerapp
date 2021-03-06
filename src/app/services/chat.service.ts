import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSidenav } from "@angular/material";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { ChatRoom } from "../models/ChatRoom";
import { UsersService } from "./users.service";
import { User } from "../models/User";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(private http?: HttpClient, private _usersS?: UsersService) {}

  private sidenavChat: MatSidenav;
  private mainSidenav: MatSidenav;
  private chatRoomData = new Subject<any>();
  private chatRoomHeader = new Subject<any>();
  private chatRoomsList = new Subject<any>();
  private chatRoomMessages = new Subject<any>();
  private isNotesShowing = new Subject<any>();
  private lawyerRoomData = new Subject<any>();

  // Observable Functions
  createChatMessage(roomId: string, messageData?: any): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    const data = {
      roomId,
      messageData,
    };

    const url = `${environment.URI}/api/chat/message`;

    return this.http
      .post<ChatRoom>(url, data, { headers })
      .pipe(
        map((resp: any) => resp),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  createChatRoom(roomData: ChatRoom, messageData?: any): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    const data = {
      roomData,
      messageData,
    };

    const url = `${environment.URI}/api/chat`;

    return this.http
      .post<ChatRoom>(url, data, { headers })
      .pipe(
        map((resp: any) => resp),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getChatMessages(idRoom: any) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    const url = `${environment.URI}/api/chat/message/all/${idRoom}`;

    return this.http
      .get<ChatRoom>(url, { headers })
      .pipe(
        map((resp: any) =>
          this.setChatRoomMessagesListSub(
            resp.messages[0],
            resp.messages[0].chat_room_id,
            true
          )
        ),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getChatRooms(idUser: any) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    const url = `${environment.URI}/api/chat/all/${idUser}`;

    return this.http
      .get<ChatRoom>(url, { headers })
      .pipe(
        map((resp: any) => {
          this.setChatRoomsListSub(resp.completeRooms);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  geIsNotesShowingSub(): Observable<any> {
    return this.isNotesShowing.asObservable();
  }

  setIsNotesShowingSub(isShowing: boolean) {
    this.isNotesShowing.next(isShowing);
  }

  getChatRoomDataSub(): Observable<any> {
    return this.chatRoomData.asObservable();
  }

  setChatRoomDataSub(
    creator_id?: string,
    image?: string,
    name?: string,
    members?: any[],
    chat_room_id?: string
  ) {
    this.chatRoomData.next({
      creator_id,
      image,
      name,
      members,
      chat_room_id,
    });
  }

  getChatRoomMessagesListSub(): Observable<any> {
    return this.chatRoomMessages.asObservable();
  }

  setChatRoomMessagesListSub(messages: any, room: any, isCreating?: boolean) {
    this.chatRoomMessages.next({
      messages: messages.messages,
      room,
      isCreating,
    });
  }

  getChatRoomsListSub(): Observable<any> {
    return this.chatRoomsList.asObservable();
  }

  setChatRoomsListSub(rooms: any) {
    this.chatRoomsList.next(rooms);
  }

  getChatRoomHeaderSub(): Observable<any> {
    return this.chatRoomHeader.asObservable();
  }

  setChatRoomHeaderSub(image?: string, name?: string) {
    this.chatRoomHeader.next({
      image,
      name,
    });
  }

  getLawyerRoomData(): Observable<any> {
    return this.lawyerRoomData.asObservable();
  }

  setLawyerRoomData(lawyerData: any) {
    this.lawyerRoomData.next(lawyerData);
  }

  // Normal Functions

  public setChatSidenav(sidenav: MatSidenav) {
    this.sidenavChat = sidenav;
  }

  public setMainSidenav(sidenav: MatSidenav) {
    this.mainSidenav = sidenav;
  }

  public openChat() {
    return this.sidenavChat.open();
  }

  public closeChat() {
    return this.sidenavChat.close();
  }

  public toggleChat(isShowing?: boolean): void {
    this.setIsNotesShowingSub(isShowing);
    this.sidenavChat.toggle();
  }

  public toggleMainSidenav(): void {
    this.mainSidenav.toggle();
  }
}
