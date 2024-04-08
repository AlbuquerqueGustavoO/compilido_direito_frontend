import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CivilComponent } from './civil/civil.component';
import { CivilRoutingModule } from './civil-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CivilCodigoProcessoComponent } from './civil-codigo-processo/civil-codigo-processo.component';
import { CivilNormasDireitoBrasileiroComponent } from './civil-normas-direito-brasileiro/civil-normas-direito-brasileiro.component';



@NgModule({
  declarations: [
    CivilComponent,
    CivilCodigoProcessoComponent,
    CivilNormasDireitoBrasileiroComponent
  ],
  imports: [
    CommonModule,
    CivilRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CivilModule { }
