import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { UsuariosService } from '../../../../services/usuarios.service';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { WebPushNotificationService } from '../../../../services/webPushNotification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conf-general',
  templateUrl: './conf-general.component.html',
  styleUrls: ['./conf-general.component.css']
})
export class ConfGeneralComponent implements OnInit, OnDestroy {

  usuario: Usuario;
  readonly VAPID_PUBLIC_KEY = 'BFzRa32U-hCa5uiD2nHyiJx_OBHj3v2q9C_-sjyA_xMy2N6E62Uw8GFfGzMa5bQOgxGceTgajzejbTExleHbMXM';

  notificationsSubs: Subscription;

  constructor(
    public _usuarioS: UsuariosService,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    public _webPN: WebPushNotificationService
  ) {
    this.usuario = this._usuarioS.user;
  }

  ngOnInit() {
    this.reloadCache()
    this.notificationsSubs = this._webPN.getNotifications()
        .subscribe(notification => {
          console.log(notification)

          if(notification) {
            this._webPN.get()
                .subscribe(resp => {
                  console.log(resp)
                })
          }
        });
  }

  actualizar(usuario: any) {
    // console.log(usuario)
    this.usuario.address = usuario.address;
    this.usuario.cellPhone = usuario.cellPhone;
    this.usuario.email = usuario.emailU;
    this.usuario.firstName = usuario.firstName;
    this.usuario.lastName = usuario.lastName;

    this._usuarioS.actualizarUsuario(this.usuario._id, this.usuario)
        .subscribe(r => {
          console.log(r)
          this.subscribeToNotification(this.usuario.firstName);
        });
  }

  ngOnDestroy() {
    this.notificationsSubs.unsubscribe();
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

  subscribeToNotification(name: string) {
    if(this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(sub => {
        
        console.log()
        this._webPN.postSubscription(sub, name)
            .subscribe(r => {
              console.log(r)
            })
      })
      .catch(console.log)
    }
  }

}
