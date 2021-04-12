import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { DataTablesModule } from "angular-datatables";
import { NgxPaginationModule } from "ngx-pagination";

import { CLIENTE_ROUTING } from "./clientes.routing";
import { ContactComponent } from "../pages/contact/contact.component";
import { HomeComponent } from "../pages/home/home.component";
import { PagesComponent } from "../pages/pages.component";
import { PerfilComponent } from "../pages/perfil/perfil.component";
import { PerfilModule } from "../pages/perfil/perfil.module";
import { CommentsComponent } from "../pages/post-detail/comments/comments.component";
import { PipesModule } from "../pipes/pipes.module";
import { PostDetailComponent } from "../pages/post-detail/post-detail.component";
import { PostsUComponent } from "../pages/postsU/postsU.component";
import { MaterialModule } from "../shared/material.module";
import { SharedModule } from "../shared/shared.module";
import { ComponentsModule } from "../components/components.module";
import { AbogadosComponent } from "../pages/abogados/abogados.component";
import { AbogadoDetalleComponent } from "../pages/abogados/abogado-detalle/abogado-detalle.component";
import { PracticeAreasComponent } from "../pages/practice-areas/practice-areas.component";
import { AreaDetailComponent } from "../pages/practice-areas/area-detail/area-detail.component";

@NgModule({
  declarations: [
    AbogadosComponent,
    AbogadoDetalleComponent,
    AreaDetailComponent,
    CommentsComponent,
    ContactComponent,
    HomeComponent,
    PagesComponent,
    PerfilComponent,
    PostDetailComponent,
    PostsUComponent,
    PracticeAreasComponent,
  ],
  imports: [
    CLIENTE_ROUTING,
    CommonModule,
    ComponentsModule,
    DataTablesModule,
    FormsModule,
    MaterialModule,
    NgxPaginationModule,
    PerfilModule,
    PipesModule,
    ReactiveFormsModule,
    SharedModule,
    [SweetAlert2Module.forRoot()],
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClientesModule {}
