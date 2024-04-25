import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodigoTributarioComponent } from './codigo-tributario/codigo-tributario.component';



const routes: Routes = [
    {
        path: '',
        // data: {roles: ['tributario']},
        children: [
            { path: '', component: CodigoTributarioComponent },
            { path: 'tributario', component: CodigoTributarioComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TributarioRoutingModule { }
