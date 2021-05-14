import { RouterModule, Routes } from "@angular/router";

import { LoginGuard } from "../guards/login.guard";
import { ContactComponent } from "../pages/contact/contact.component";
import { HomeComponent } from "../pages/home/home.component";
import { PerfilComponent } from "../pages/perfil/perfil.component";
import { ConfGeneralComponent } from "../pages/perfil/perfilPages/conf-general/conf-general.component";
import { EventosComponent } from "../pages/perfil/perfilPages/eventos/eventos.component";
import { CasosDetalleComponent } from "../pages/perfil/perfilPages/casos-detalle/casos-detalle.component";
import { MisCasosComponent } from "../pages/perfil/perfilPages/mis-casos/mis-casos.component";
import { InformacionComponent } from "../pages/perfil/perfilPages/informacion/informacion.component";
import { MensajesComponent } from "../pages/perfil/perfilPages/mensajes/mensajes.component";
import { PostDetailComponent } from "../pages/post-detail/post-detail.component";
import { PostsUComponent } from "../pages/postsU/postsU.component";
import { AbogadosComponent } from "../pages/abogados/abogados.component";
import { AbogadoDetalleComponent } from "../pages/abogados/abogado-detalle/abogado-detalle.component";
import { PracticeAreasComponent } from "../pages/practice-areas/practice-areas.component";
import { AreaDetailComponent } from "../pages/practice-areas/area-detail/area-detail.component";
import { EmailConfirmedComponent } from "../components/email-confirmed/email-confirmed.component";

const PAGES_ROUTES: Routes = [
  {
    path: "abogados",
    component: AbogadosComponent,
  },
  {
    path: "abogado-detalle/:id",
    component: AbogadoDetalleComponent,
  },
  {
    path: "areas-practica",
    component: PracticeAreasComponent,
  },
  {
    path: "area-detalle/:id",
    component: AreaDetailComponent,
  },
  {
    path: "articulos",
    component: PostsUComponent,
  },
  {
    path: "articulo-detalle/:id",
    component: PostDetailComponent,
  },
  {
    path: ":tipo/:action/:token",
    component: EmailConfirmedComponent,
  },
  {
    path: ":user/:action",
    component: EmailConfirmedComponent,
  },
  {
    path: "contacto",
    component: ContactComponent,
  },
  {
    path: "inicio",
    component: HomeComponent,
  },
  {
    path: "perfil",
    component: PerfilComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: "",
        component: ConfGeneralComponent,
      },
      {
        path: "general",
        component: ConfGeneralComponent,
      },
      {
        path: "eventos",
        component: EventosComponent,
      },
      {
        path: "caso-detalle/:id",
        component: CasosDetalleComponent,
      },
      {
        path: "casos",
        component: MisCasosComponent,
      },
      {
        path: "informacion",
        component: InformacionComponent,
      },
      {
        path: "mensajes",
        component: MensajesComponent,
      },
    ],
  },
  {
    path: "",
    redirectTo: "/inicio",
    pathMatch: "full",
  },
];

export const CLIENTE_ROUTING = RouterModule.forChild(PAGES_ROUTES);
