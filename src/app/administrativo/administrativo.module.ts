import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module/shared-module';
import { HttpClientModule } from '@angular/common/http';
import { AdministativoRoutingModule } from './administrativo-routing.module';
import { LeiLicitacoesContratosAdministrativosComponent } from './lei-licitacoes-contratos-administrativos/lei-licitacoes-contratos-administrativos.component';
import { ImprobidadeAdministrativaComponent } from './improbidade-administrativa/improbidade-administrativa.component';
import { ServicosPublicosComponent } from './servicos-publicos/servicos-publicos.component';



@NgModule({
  declarations: [

  
    LeiLicitacoesContratosAdministrativosComponent,
        ImprobidadeAdministrativaComponent,
        ServicosPublicosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    AdministativoRoutingModule
  ]
})
export class AdministrativoModule { }
