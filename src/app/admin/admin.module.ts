import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module/shared-module';
import { HttpClientModule } from '@angular/common/http';
import { AdminRoutingModule } from './admin-routing.module';

import { ContatoComponent } from './contato/contato.component';



@NgModule({
  declarations: [  
    ContatoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
