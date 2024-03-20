import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CivilComponent } from './civil/civil.component';
import { CivilRoutingModule } from './civil-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CivilComponent
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
