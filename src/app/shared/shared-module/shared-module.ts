import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { ButtontotopComponent } from '../buttontotop/buttontotop.component';




@NgModule({
  declarations: [
        MenuComponent,
        FooterComponent,
        ButtontotopComponent,
      ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    MenuComponent,
    FooterComponent,
    ButtontotopComponent,
  ],
})
export class SharedModule { }
