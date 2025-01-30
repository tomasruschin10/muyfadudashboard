import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardsRoutingModule } from './reward-requests.routing';
import { RewardRequestsComponent } from './reward-requests.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    RewardRequestsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RewardsRoutingModule
  ]
})
export class RewardsRequestModule { }