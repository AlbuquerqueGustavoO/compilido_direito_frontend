import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodigoPenalComponent } from './codigo-penal/codigo-penal.component';
import { CodigoProcessoPenalComponent } from './codigo-processo-penal/codigo-processo-penal.component';
import { CrimesHediondosComponent } from './crimes-hediondos/crimes-hediondos.component';
import { MariaPenhaComponent } from './maria-penha/maria-penha.component';



const routes: Routes = [
    {
        path: '',
        // data: {roles: ['penal']},
        children: [
            { path: '', component: CodigoPenalComponent },
            { path: 'processo-penal', component: CodigoProcessoPenalComponent },
            { path: 'crimes-hediondos', component: CrimesHediondosComponent },
            { path: 'lei-maria-penha', component: MariaPenhaComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PenalRoutingModule { }
