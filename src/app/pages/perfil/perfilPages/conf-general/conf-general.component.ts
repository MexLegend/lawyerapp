import { Component, OnDestroy, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { Subscription } from 'rxjs';

import { User } from '../../../../models/User';
import { UsersService } from '../../../../services/users.service';
import { WebPushNotificationsService } from '../../../../services/webPushNotifications.service';
import { ImgService } from '../../../../services/img.service';

@Component({
  selector: 'app-conf-general',
  templateUrl: './conf-general.component.html',
  styleUrls: ['./conf-general.component.css']
})
export class ConfGeneralComponent implements OnInit, OnDestroy {

  constructor(
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    public _imgS: ImgService,
    public _usersS: UsersService,
    public _webPN: WebPushNotificationsService
  ) {
    this.user = this._usersS.user;
  }
  
  notificationsSubs: Subscription;
  user: User;
  readonly VAPID_PUBLIC_KEY = 'BFzRa32U-hCa5uiD2nHyiJx_OBHj3v2q9C_-sjyA_xMy2N6E62Uw8GFfGzMa5bQOgxGceTgajzejbTExleHbMXM';

  ngOnInit() {
    this.reloadCache()
    this.notificationsSubs = this._webPN.getNotifications()
      .subscribe(notification => {
        console.log(this._usersS.user.role);
        if (notification) {
          console.log('Notification: ' + notification)
          this._webPN.get()
            .subscribe(resp => {
              console.log('Resp: ' + resp)
            })
        }
      });
      this._imgS.fileUrl = this.user.img;
  }

  ngOnDestroy() {
    this.notificationsSubs.unsubscribe();
  }

  imageValidation($event) {
    this._imgS.imageValidation($event)
  }

  reloadCache() {
    if ( this.swUpdate.isEnabled ) {
      this.swUpdate.available.subscribe(() => {
        if ( confirm("Hay una nueva version, desea actualizar?") ) {
          window.location.reload()
        }
      })
    }
  }

  subscribeToNotification(name: string) {
    if ( this.swPush.isEnabled ) {
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
        .then(sub => {

          this._webPN.postSubscription(sub, name)
            .subscribe(resp => {
              console.log('Resp PostSubs: ' + resp)
            })
        })
        .catch(console.log)
    }
  }

  update(user: any) {
    console.log(this._imgS.file)
    this.user.address = user.address;
    this.user.cellPhone = user.cellPhone;
    this.user.email = user.emailU;
    this.user.firstName = user.firstName;
    this.user.lastName = user.lastName;
    if( this._imgS.file !== undefined ) {
      this.user.img = this._imgS.file
    }

    this._usersS.updateUser(this.user._id, this.user)
      .subscribe(resp => {
        console.log(resp)
        this.subscribeToNotification(this.user.firstName);
      });
  }
}
