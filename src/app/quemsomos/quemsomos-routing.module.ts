import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApresentacaoComponent } from './apresentacao/apresentacao.component';


const routes: Routes = [
    
        { path: '', component: ApresentacaoComponent },
        { path: 'apresentacao', component: ApresentacaoComponent },
        // { path: 'confirm', component: ConfirmComponent }  
]

// const routes: Routes = [
//     {
//         path: '',
//         // data: {roles: ['quemsomos']},
//         children: [
//             { path: '', component: ApresentacaoComponent },      
//         ]
//     }
// ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuemSomosRoutingModule { }
