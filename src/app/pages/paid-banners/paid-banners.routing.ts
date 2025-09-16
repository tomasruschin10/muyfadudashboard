import { RouterModule, Routes } from '@angular/router';
import { PaidBannersComponent } from './paid-banners.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '', component: PaidBannersComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidBannersRoutingModule { }