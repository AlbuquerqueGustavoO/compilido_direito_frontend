import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

import { ErrorComponent } from './error/error.component';
import { ApresentacaoComponent } from './quemsomos/apresentacao/apresentacao.component';




const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  { path: '', component: ApresentacaoComponent, pathMatch: 'full', canActivate: [authGuard] },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard],
  },
  {
    path: 'quemsomos',
    loadChildren: () => import("./quemsomos/quemsomos.module").then(m => m.QuemSomosModule),
    canActivate: [authGuard],
  },
  {
    path: 'civil',
    loadChildren: () => import("./civil/civil.module").then(m => m.CivilModule),
    canActivate: [authGuard],
  },
  {
    path: 'constitucional',
    loadChildren: () => import("./constitucional/constitucional.module").then(m => m.ConstitucionalModule),
    canActivate: [authGuard],
  },
  {
    path: 'administrativo',
    loadChildren: () => import("./administrativo/administrativo.module").then(m => m.AdministrativoModule),
    canActivate: [authGuard],
  },
  {
    path: 'tributario',
    loadChildren: () => import("./tributario/tributario.module").then(m => m.TributarioModule),
    canActivate: [authGuard],
  },
  {
    path: 'penal',
    loadChildren: () => import("./penal/penal.module").then(m => m.PenalModule),
    canActivate: [authGuard],
  },
  { path: '**', component: ErrorComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
