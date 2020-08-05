import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private sidenavChat: MatSidenav;

    public setChatSidenav(sidenav: MatSidenav) {
        this.sidenavChat = sidenav;
    }

    public openChat() {
        return this.sidenavChat.open();
    }

    public closeChat() {
        return this.sidenavChat.close();
    }

    public toggleChat(): void {
        this.sidenavChat.toggle();
    }
}
