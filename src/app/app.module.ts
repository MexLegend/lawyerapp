import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { APP_ROUTING } from './app.routes';
import { ClientesComponent } from './clientes/clientes.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalsModule } from './modals/modals.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment.prod';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: environment.URI, options: {} }

@NgModule({
  declarations: [
    AdminComponent,
    AppComponent,
    ClientesComponent
  ],
  imports: [
    APP_ROUTING,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ModalsModule,
    NgScrollbarModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SharedModule,
    SocketIoModule.forRoot(config)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
