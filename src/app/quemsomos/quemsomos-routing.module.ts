import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApresentacaoComponent } from './apresentacao/apresentacao.component';
import { ReferenciasComponent } from './referencias/referencias.component';


const routes: Routes = [
    {
        path: '',
        // data: {roles: ['quemsomos']},
        children: [
            { path: '', component: ApresentacaoComponent },
            { path: 'apresentacao', component: ApresentacaoComponent },
            { path: 'referencias', component: ReferenciasComponent }       
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuemSomosRoutingModule { }
