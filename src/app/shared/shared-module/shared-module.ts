import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { ButtontotopComponent } from '../buttontotop/buttontotop.component';
import { LegalContentComponent } from '../legal-content/legal-content.component';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
        SidebarComponent,
        TopbarComponent,
        FooterComponent,
        ButtontotopComponent,
        LegalContentComponent,
      ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    ButtontotopComponent,
    LegalContentComponent,
  ],
})
export class SharedModule { }
