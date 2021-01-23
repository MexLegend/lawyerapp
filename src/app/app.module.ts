import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";

// Cloudinary module
import {
  CloudinaryModule,
} from "@cloudinary/angular-5.x";
import { Cloudinary as CloudinaryCore } from "cloudinary-core";
export const cloudinary = {
  Cloudinary: CloudinaryCore
};
import { CloudinarySettings } from "./settings";

import { AutosizeModule } from 'ngx-autosize';

import { CookieService } from 'ngx-cookie-service';

import { NgxPaginationModule } from 'ngx-pagination';

import {
  PerfectScrollbarModule, PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';

import { NgScrollbarModule } from "ngx-scrollbar";

import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";

import { environment } from "../environments/environment.prod";

import { AdminComponent } from "./admin/admin.component";
import { AppComponent } from "./app.component";
import { APP_ROUTING } from "./app.routes";
import { ClientesComponent } from "./clientes/clientes.component";
import { ComponentsModule } from './components/components.module';
import { ErrorInterceptorService } from './interceptors/error-interceptor.service';
import { ModalsModule } from "./modals/modals.module";
import { PipesModule } from "./pipes/pipes.module";
import { SharedModule } from "./shared/shared.module";
import { MatSelectModule } from '@angular/material/select'; 
import { MatDividerModule } from '@angular/material/divider'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const config: SocketIoConfig = { url: environment.URI, options: {} };
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  useBothWheelAxes: false,
  suppressScrollX: true
};

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AdminComponent, AppComponent, ClientesComponent],
  imports: [
    APP_ROUTING,
    AutosizeModule,
    BrowserAnimationsModule,
    BrowserModule,
    CloudinaryModule.forRoot(cloudinary, CloudinarySettings),
    ComponentsModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ModalsModule,
    NgScrollbarModule,
    NgxPaginationModule,
    PipesModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    SharedModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    CookieService,
    {
      provide: [PERFECT_SCROLLBAR_CONFIG],
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
