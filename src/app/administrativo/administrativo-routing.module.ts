import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeiLicitacoesContratosAdministrativosComponent } from './lei-licitacoes-contratos-administrativos/lei-licitacoes-contratos-administrativos.component';
import { ImprobidadeAdministrativaComponent } from './improbidade-administrativa/improbidade-administrativa.component';
import { ServicosPublicosComponent } from './servicos-publicos/servicos-publicos.component';
import { ProcessoAdministrativoComponent } from './processo-administrativo/processo-administrativo.component';
import { ServidoresPublicosComponent } from './servidores-publicos/servidores-publicos.component';
import { ParceriaPublicoComponent } from './parceria-publico/parceria-publico.component';



const routes: Routes = [
    {
        path: '',
        // data: {roles: ['quemsomos']},
        children: [
            { path: '', component: LeiLicitacoesContratosAdministrativosComponent },
            { path: 'administrativo', component: LeiLicitacoesContratosAdministrativosComponent },
            { path: 'administrativo-improbidade', component: ImprobidadeAdministrativaComponent },
            { path: 'administrativo-servicosPublicos', component: ServicosPublicosComponent }, 
            { path: 'administrativo-processo', component: ProcessoAdministrativoComponent },
            { path: 'administrativo-servidoresPublicos', component: ServidoresPublicosComponent },
            { path: 'administrativo-parceriaPublico', component: ParceriaPublicoComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministativoRoutingModule { }
