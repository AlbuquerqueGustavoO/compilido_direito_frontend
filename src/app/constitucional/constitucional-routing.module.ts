import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstituicaoComponent } from './constituicao/constituicao.component';
import { ConstitucionalEstadoSpComponent } from './constitucional-estado-sp/constitucional-estado-sp.component';


const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: ConstituicaoComponent },
            { path: 'constitucional', component: ConstituicaoComponent },
            { path: 'constitucional-estado-sp', component: ConstitucionalEstadoSpComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConstitucionalRoutingModule { }
