import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './auth/auth.guard';

import { ErrorComponent } from './error/error.component';
import { ApresentacaoComponent } from './quemsomos/apresentacao/apresentacao.component';




const routes: Routes = [
  { path: '', component: ApresentacaoComponent, pathMatch: 'full'},
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    // canLoad: [AuthGuard],
    // data: {roles: ['admin']}
  },
  { 
    path: 'quemsomos',
    loadChildren: () => import("./quemsomos/quemsomos.module").then(m => m.QuemSomosModule),
    // canLoad: [AuthGuard],
    // data: {roles: ['quemsomos']}
  },
  { 
    path: 'civil',
    loadChildren: () => import("./civil/civil.module").then(m => m.CivilModule),
    // canLoad: [AuthGuard],
    // data: {roles: ['quemsomos']}
  },
  { 
    path: 'constitucional',
    loadChildren: () => import("./constitucional/constitucional.module").then(m => m.ConstitucionalModule),
    // canLoad: [AuthGuard],
    // data: {roles: ['quemsomos']}
  },
  { 
    path: 'administrativo',
    loadChildren: () => import("./administrativo/administrativo.module").then(m => m.AdministrativoModule),
    // canLoad: [AuthGuard],
    // data: {roles: ['quemsomos']}
  },
  { 
    path: 'tributario',
    loadChildren: () => import("./tributario/tributario.module").then(m => m.TributarioModule),
    // canLoad: [AuthGuard],
    // data: {roles: ['quemsomos']}
  },
  { 
    path: 'penal',
    loadChildren: () => import("./penal/penal.module").then(m => m.PenalModule),
    // canLoad: [AuthGuard],
    // data: {roles: ['quemsomos']}
  },
  { path: '**', component: ErrorComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
