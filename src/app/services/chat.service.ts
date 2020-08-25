import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private sidenavChat: MatSidenav;
    private mainSidenav: MatSidenav;

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

    public toggleChat(): void {
        this.sidenavChat.toggle();
    }

    public toggleMainSidenav(): void {
        this.mainSidenav.toggle();
    }
}
