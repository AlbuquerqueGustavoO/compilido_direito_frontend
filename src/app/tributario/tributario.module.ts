import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module/shared-module';
import { HttpClientModule } from '@angular/common/http';
import { TributarioRoutingModule } from './tributario-routing.module';
import { CodigoTributarioComponent } from './codigo-tributario/codigo-tributario.component';



@NgModule({
  declarations: [
    CodigoTributarioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    TributarioRoutingModule
  ]
})
export class TributarioModule { }
