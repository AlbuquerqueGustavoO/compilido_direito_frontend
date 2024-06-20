import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContatoComponent } from './contato/contato.component';




const routes: Routes = [
    {
        path: '',
        // data: {roles: ['quemsomos']},
        children: [
            { path: '', component: ContatoComponent },
            { path: 'contato', component: ContatoComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
