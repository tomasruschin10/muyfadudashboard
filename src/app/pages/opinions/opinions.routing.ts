import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpinionsComponent } from './opinions.component';

const routes: Routes = [{
  path: '', component: OpinionsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpinionsRoutingModule { }
