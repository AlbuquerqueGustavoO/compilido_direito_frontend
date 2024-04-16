import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { QuemSomosRoutingModule } from './quemsomos-routing.module';
import { SharedModule } from '../shared/shared-module/shared-module';
import { ApresentacaoComponent } from './apresentacao/apresentacao.component';
import { ReferenciasComponent } from './referencias/referencias.component';





@NgModule({
  declarations: [
    ApresentacaoComponent,
    ReferenciasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    QuemSomosRoutingModule
  ]
})
export class QuemSomosModule { }
