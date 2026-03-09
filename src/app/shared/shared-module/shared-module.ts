import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { ButtontotopComponent } from '../buttontotop/buttontotop.component';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
        MenuComponent,
        FooterComponent,
        ButtontotopComponent,
        SearchFilterComponent,
      ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    MenuComponent,
    FooterComponent,
    ButtontotopComponent,
    SearchFilterComponent,
  ],
})
export class SharedModule { }
