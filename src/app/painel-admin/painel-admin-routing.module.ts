import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelAdminComponent } from './painel-admin.component';

const routes: Routes = [
    { path: '', component: PainelAdminComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PainelAdminRoutingModule { }
