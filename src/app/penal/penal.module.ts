import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { SharedModule } from '../shared/shared-module/shared-module';
import { PenalRoutingModule } from './penal-routing.module';
import { CodigoPenalComponent } from './codigo-penal/codigo-penal.component';
import { CodigoProcessoPenalComponent } from './codigo-processo-penal/codigo-processo-penal.component';
import { CrimesHediondosComponent } from './crimes-hediondos/crimes-hediondos.component';
import { MariaPenhaComponent } from './maria-penha/maria-penha.component';
import { LeiDrogasComponent } from './lei-drogas/lei-drogas.component';
import { OrganizacaoCriminosaComponent } from './organizacao-criminosa/organizacao-criminosa.component';
import { OcultacaoBensComponent } from './ocultacao-bens/ocultacao-bens.component';




@NgModule({
  declarations: [
    CodigoPenalComponent,
    CodigoProcessoPenalComponent,
    CrimesHediondosComponent,
    MariaPenhaComponent,
    LeiDrogasComponent,
    OrganizacaoCriminosaComponent,
    OcultacaoBensComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    PenalRoutingModule
  ]
})
export class PenalModule { }
