import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LostObjectComponent } from './lost-object.component';

const routes: Routes = [{
  path: '', component: LostObjectComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LostObjectRoutingModule { }
