import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { adminGuard } from './auth/admin.guard';

import { ErrorComponent } from './error/error.component';




const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule),
  },
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
  {
    path: 'configuracoes',
    loadChildren: () => import('./configuracoes/configuracoes.module').then(m => m.ConfiguracoesModule),
    canActivate: [authGuard],
  },
  {
    path: 'painel-admin',
    loadChildren: () => import('./painel-admin/painel-admin.module').then(m => m.PainelAdminModule),
    canActivate: [authGuard, adminGuard],
  },
  { path: '**', component: ErrorComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
