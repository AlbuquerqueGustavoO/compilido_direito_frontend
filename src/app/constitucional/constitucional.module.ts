import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConstitucionalRoutingModule } from './constitucional-routing.module';
import { ConstituicaoComponent } from './constituicao/constituicao.component';
import { ConstitucionalEstadoSpComponent } from './constitucional-estado-sp/constitucional-estado-sp.component';
import { SharedModule } from '../shared/shared-module/shared-module';



@NgModule({
  declarations: [
    ConstituicaoComponent,
    ConstitucionalEstadoSpComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ConstitucionalRoutingModule,
    SharedModule
  ]
})
export class ConstitucionalModule { }
