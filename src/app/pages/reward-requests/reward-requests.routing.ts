import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RewardRequestsComponent } from './reward-requests.component';

const routes: Routes = [
  {
    path: '',
    component: RewardRequestsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardsRoutingModule { }