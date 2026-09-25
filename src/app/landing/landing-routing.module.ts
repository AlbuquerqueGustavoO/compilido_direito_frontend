import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { guestGuard } from '../auth/guest.guard';
import { LandingComponent } from './landing.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
    data: { standalone: true },
    canActivate: [guestGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule { }
