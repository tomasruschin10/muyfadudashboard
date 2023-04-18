import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdPageComponent } from './ad-page.component';

const routes: Routes = [{
  path: '', component: AdPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdPageRoutingModule { }
