import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CivilComponent } from './civil/civil.component';



// const routes: Routes = [
//         { path: '', component: CivilComponent },
//         { path: 'apresentacao', component: CivilComponent }
// ]

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: CivilComponent },
            { path: 'civil', component: CivilComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CivilRoutingModule { }
