import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardsRoutingModule } from './rewards.routing';
import { RewardsComponent } from './rewards.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    RewardsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RewardsRoutingModule
  ]
})
export class RewardsModule { }