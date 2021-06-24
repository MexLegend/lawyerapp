import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  PerfectScrollbarComponent,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
import { UtilitiesService } from "src/app/services/utilities.service";
import { ChatService } from "../../services/chat.service";
import { UsersService } from "../../services/users.service";
import { User } from "../../models/User";
import { Subscription } from "rxjs";
import { ContactService } from "../../services/contact.service";

@Component({
  selector: "app-chat-sidenav",
  templateUrl: "./chat-sidenav.component.html",
  styleUrls: ["./chat-sidenav.component.css"],
})
export class ChatSidenavComponent implements OnInit {
  constructor(
    public _chatS: ChatService,
    public _contactS: ContactService,
    public _utilitiesS: UtilitiesService,
    public _usersS: UsersService
  ) {}

  @ViewChild("chatBodyContainer", {static: false}) private chatBodyContainer: ElementRef;
  @ViewChild("chatBodyScrollbar", {static: false})
  chatBodyScrollbar: PerfectScrollbarComponent;

  subscriptionsArray: Subscription[] = [];

  // Form Fields Variables
  sendMessageForm: FormGroup;

  // Perfect Scrollbar Variable
  public config: PerfectScrollbarConfigInterface = {};

  // Chat Sidenav Variables
  public activeRoomId: string = null;
  public contactsList: User[] = [];
  public isCreatingRoom: boolean = false;
  public isLoading: boolean = true;
  public isNewLawyerContact: boolean = false;
  public isSearchingNote: boolean = false;
  public isSearchingUser: boolean = false;
  public usersTab = new FormControl(0);
  public chatTab = new FormControl(0);
  public notesTab = new FormControl(0);
  public roomData: any = {
    chat_room_id: null,
    creator_id: null,
    image: null,
    name: "Sin Título",
    members: [],
  };
  public roomHeader: any = {
    image: null,
    name: "Sin Título",
  };
  public roomsList: any[] = [];
  public roomMessagesList: any[] = [];
  public sidenavIndex = null;
  public sidenavType = null;

  ngOnInit() {
    // Init Chat Message Form
    this.setMessageForm();

    // Get Contacts Subscription
    this.subscriptionsArray.push(
      this._contactS.getContacts(this._usersS.user._id).subscribe()
    );

    // List Contacts Subscription
    this.subscriptionsArray.push(
      this._contactS.getContactsList().subscribe((contactsList) => {
        contactsList
          .sort(function (a: any, b: any) {
            var textA = a.contact.firstName.toUpperCase();
            var textB = b.contact.firstName.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          })
          .map(
            (contact: any) =>
              (this.contactsList = [...this.contactsList, contact.contact])
          );
          this.isLoading = false;
      })
    );

    // Get Rooms Subscription
    this.subscriptionsArray.push(
      this._chatS.getChatRooms(this._usersS.user._id).subscribe()
    );

    // List Rooms Subscription
    this.subscriptionsArray.push(
      this._chatS.getChatRoomsListSub().subscribe((rooms) => {
        rooms.map((room: any) => {
          this.roomsList = [
            { room: room.chat_room_id, lastMessage: room.messages[0] },
            ...this.roomsList,
          ];
        });
      })
    );

    // Get Chat Room Data
    this.subscriptionsArray.push(
      this._chatS.getChatRoomDataSub().subscribe((roomData) => {
        this.roomData = roomData;
      })
    );

    // Get Chat Room Header Data
    this.subscriptionsArray.push(
      this._chatS.getChatRoomHeaderSub().subscribe((roomHeaderData) => {
        this.roomHeader = roomHeaderData;
      })
    );

    // List Room Messages Subscription
    this.subscriptionsArray.push(
      this._chatS.getChatRoomMessagesListSub().subscribe((messageData) => {
        this.scrollChatToBottom();

        // Update Current Chat Room Messages List
        if (
          (this.roomData.chat_room_id &&
            this.roomData.chat_room_id === messageData.room) ||
          messageData.isCreating
        ) {
          messageData.messages.map((message: any) => {
            this.roomMessagesList = [...this.roomMessagesList, message];
          });
        }

        this.roomsList = this.roomsList.map((room) =>
          room.room._id === messageData.room
            ? {
                ...room,
                lastMessage: messageData.messages.slice(-1).pop(),
              }
            : room
        );
      })
    );

    // Get Lawyer Chat Room Data
    this.subscriptionsArray.push(
      this._chatS.getLawyerRoomData().subscribe((lawyerData) => {
        this.seeChatDetails(true, null, lawyerData, true);
        this.isNewLawyerContact = true;
      })
    );
  }

  // Unsubscribe Any Subscription
  ngOnDestroy() {
    this.subscriptionsArray.map((subscription) => subscription.unsubscribe());
  }

  getChatRoomMessages(room_id: string) {
    // Reset Chat Messages Array For New Enties
    this.roomMessagesList = [];

    // Get Room Messages Subscription
    this.subscriptionsArray.push(
      this._chatS.getChatMessages(room_id).subscribe()
    );
  }

  // Set Chat User Info
  getChatRoomData(members: any[]): any {
    const memberData: any = members.find(
      (member: any) => member.member._id !== this._usersS.user._id
    );

    return {
      roomName: memberData.member.firstName + " " + memberData.member.lastName,
      roomImg: memberData.member.img,
    };
  }

  // Init Message Form
  setMessageForm() {
    this.sendMessageForm = new FormGroup({
      message: new FormControl(null, [
        Validators.required,
        this._utilitiesS.noWhitespaceValidator,
      ]),
    });
  }

  // Search Chat User
  searchChatUser(value: any) {
    this.isSearchingUser = value;

    if (value) {
      this.usersTab.setValue(1);
    } else {
      this.usersTab.setValue(0);
    }
  }

  // See Chat Details
  seeChatDetails(
    showConversation: any,
    roomData: any = null,
    userData: any = null,
    isCreating: boolean = false
  ) {
    this.searchChatUser(false);
    if (showConversation) {
      this.isCreatingRoom = isCreating;
      // Validate If Contact Is Clicked
      if (userData) {
        this.roomMessagesList = [];
        // Validate If This User Has Not Conversations Created
        if (userData.rooms.length === 0) {
          this._chatS.setChatRoomDataSub(
            this._usersS.user._id,
            null,
            null,
            [
              { member: this._usersS.user._id, role: "Admin" },
              { member: userData._id, role: "Member" },
            ],
            null
          );
        } else {
          const room = this.roomsList.filter((room) =>
            userData.rooms.find(
              (userRoom: any) => userRoom.room === room.room._id
            )
          );

          // Validate If This Is The First Conversation With This User
          if (room.length === 0) {
            this._chatS.setChatRoomDataSub(
              this._usersS.user._id,
              null,
              null,
              [
                { member: this._usersS.user._id, role: "Admin" },
                { member: userData._id, role: "Member" },
              ],
              null
            );
          } else {
            this.isCreatingRoom = false;
            this.getChatRoomMessages(room[0].room._id);
            this._chatS.setChatRoomDataSub(
              room[0].room.creator_id,
              room[0].room.image,
              room[0].room.name,
              room[0].room.members,
              room[0].room._id
            );
          }
        }

        this._chatS.setChatRoomHeaderSub(
          userData.img,
          userData.firstName + " " + userData.lastName
        );
      }
      // Validate If Chat Room Is Clicked
      else {
        this._chatS.setChatRoomDataSub(
          roomData.creator_id,
          roomData.image,
          roomData.name,
          roomData.members,
          roomData._id
        );
        this._chatS.setChatRoomHeaderSub(
          this.getChatRoomData(roomData.members).roomImg,
          this.getChatRoomData(roomData.members).roomName
        );
      }
      this.chatTab.setValue(1);
    } else {
      this.sendMessageForm.reset();
      this.chatTab.setValue(0);
    }
  }

  // Send Messsage To User
  sendMsgChat() {
    // Validate If It Is Being Creating A Chat Room
    if (this.isCreatingRoom) {
      this.subscriptionsArray.push(
        this._chatS
          .createChatRoom(this.roomData, this.sendMessageForm.value)
          .subscribe(() => {
            if (this.isNewLawyerContact) {
              const lawyerContact = this._contactS
                .createContact(
                  this.roomData.members[0].member,
                  this.roomData.members[1].member
                )
                .subscribe(() => lawyerContact.unsubscribe());
            }
          })
      );
    } else {
      this.subscriptionsArray.push(
        this._chatS
          .createChatMessage(this.roomData.chat_room_id, {
            creator_id: this._usersS.user._id,
            message: this.sendMessageForm.value.message,
          })
          .subscribe()
      );
    }

    this.isCreatingRoom = false;
    this.sendMessageForm.reset();
  }

  // Scroll Chat To Last Message
  scrollChatToBottom() {
    try {
      this.chatBodyScrollbar.directiveRef.scrollToTop(
        this.chatBodyContainer.nativeElement.scrollHeight,
        1
      );
    } catch (err) {}
  }

  // Open / Close Chat Window
  toogleChatSidenav() {
    this._chatS.toggleChat();
  }
}
