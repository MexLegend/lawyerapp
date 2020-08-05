import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-sidenav',
  templateUrl: './chat-sidenav.component.html',
  styleUrls: ['./chat-sidenav.component.css']
})
export class ChatSidenavComponent implements OnInit {

  constructor(public _chatS: ChatService) { }

  // Form Fields Variables
  sendMessageForm: FormGroup;
  msgChat: any;

  // Chat Sidenav Variables
  public isSearchingUser: boolean = false;
  public usersTab = new FormControl(0);
  public chatTab = new FormControl(0);
  // Perfect Scrollbar Variable
  public config: PerfectScrollbarConfigInterface = {};

  ngOnInit() {
    // Initialize Messages Form
    this.initMessagesForm();
  }

  // Calculate TextArea Container Size Dynamically
  calculateTextAreaHeight(textareaContainer: HTMLElement): number {
    return (textareaContainer ? textareaContainer.offsetHeight : 0);
  }

  initMessagesForm() {
    this.sendMessageForm = new FormGroup({
      msgChat: new FormControl(null, Validators.required),
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
  seeChatDetails(value: any) {
    this.searchChatUser(false);

    if (value) {
      this.chatTab.setValue(1);
    } else {
      this.sendMessageForm.reset();
      this.chatTab.setValue(0);
    }
  }

  sendMsgChat() {
    console.log(this.msgChat)
  }

  toogleChatSidenav() {
    this._chatS.toggleChat();
  }
}
