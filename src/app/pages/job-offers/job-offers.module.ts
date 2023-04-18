import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobOffersRoutingModule } from './job-offers-routing.module';
import { JobOffersComponent } from './job-offers.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [JobOffersComponent],
  imports: [
    CommonModule,
    SharedModule,
    JobOffersRoutingModule,
    JobOffersRoutingModule
  ]
})
export class JobOffersModule { }
