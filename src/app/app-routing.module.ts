// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }



import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './auth/auth.guard';

import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';




const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},//{ path: '', component: HomeComponent, canActivate: [AuthGuard]}
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
