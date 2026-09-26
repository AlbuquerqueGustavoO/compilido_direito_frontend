import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainelAdminRoutingModule } from './painel-admin-routing.module';
import { PainelAdminComponent } from './painel-admin.component';

@NgModule({
    declarations: [
        PainelAdminComponent,
    ],
    imports: [
        CommonModule,
        PainelAdminRoutingModule,
    ],
})
export class PainelAdminModule { }
