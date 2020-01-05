import { Component, OnInit } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { WebPushNotificationService } from './services/webPushNotification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = 'BFzRa32U-hCa5uiD2nHyiJx_OBHj3v2q9C_-sjyA_xMy2N6E62Uw8GFfGzMa5bQOgxGceTgajzejbTExleHbMXM';

  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    public _webPN: WebPushNotificationService
  ) { }

  ngOnInit() {
    this.reloadCache()
    // this.subscribeToNotification()
  }

  reloadCache() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("Hay una nueva version, desea actualizar?")) {
          window.location.reload()
        }
      })
    }
  }

  subscribeToNotification() {
    if(this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(sub => {
        this._webPN.postSubscription(sub)
            .subscribe(r => {
              console.log(r)
            })
      })
      .catch(console.log)
    }
  }

}
