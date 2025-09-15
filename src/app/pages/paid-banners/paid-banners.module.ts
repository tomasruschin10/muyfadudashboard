
import { PaidBannersRoutingModule } from './paid-banners.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaidBannersComponent } from './paid-banners.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    PaidBannersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    PaidBannersRoutingModule
  ]
})
export class PaidBannersModule { }
