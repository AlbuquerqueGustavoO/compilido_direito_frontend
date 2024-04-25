import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodigoPenalComponent } from './codigo-penal/codigo-penal.component';
import { CodigoProcessoPenalComponent } from './codigo-processo-penal/codigo-processo-penal.component';
import { CrimesHediondosComponent } from './crimes-hediondos/crimes-hediondos.component';
import { MariaPenhaComponent } from './maria-penha/maria-penha.component';
import { LeiDrogasComponent } from './lei-drogas/lei-drogas.component';
import { OrganizacaoCriminosaComponent } from './organizacao-criminosa/organizacao-criminosa.component';
import { OcultacaoBensComponent } from './ocultacao-bens/ocultacao-bens.component';



const routes: Routes = [
    {
        path: '',
        // data: {roles: ['penal']},
        children: [
            { path: '', component: CodigoPenalComponent },
            { path: 'processo-penal', component: CodigoProcessoPenalComponent },
            { path: 'crimes-hediondos', component: CrimesHediondosComponent },
            { path: 'lei-maria-penha', component: MariaPenhaComponent },
            { path: 'lei-de-drogas', component: LeiDrogasComponent },
            { path: 'lei-organizacao-criminosa', component: OrganizacaoCriminosaComponent },
            { path: 'lei-ocultacao-bens', component: OcultacaoBensComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PenalRoutingModule { }
