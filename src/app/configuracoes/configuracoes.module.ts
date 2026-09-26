import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfiguracoesRoutingModule } from './configuracoes-routing.module';
import { PerfilComponent } from './perfil/perfil.component';

@NgModule({
    declarations: [
        PerfilComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ConfiguracoesRoutingModule,
    ],
})
export class ConfiguracoesModule { }
