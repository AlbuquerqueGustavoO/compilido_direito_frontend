import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CivilComponent } from './civil/civil.component';
import { CivilCodigoProcessoComponent } from './civil-codigo-processo/civil-codigo-processo.component';
import { CivilNormasDireitoBrasileiroComponent } from './civil-normas-direito-brasileiro/civil-normas-direito-brasileiro.component';



// const routes: Routes = [
//         { path: '', component: CivilComponent },
//         { path: 'apresentacao', component: CivilComponent }
// ]

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: CivilComponent },
            { path: 'civil', component: CivilComponent },
            { path: 'civil-codigo-processo', component: CivilCodigoProcessoComponent },
            { path: 'civil-normas-direito-brasileiro', component: CivilNormasDireitoBrasileiroComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CivilRoutingModule { }
