import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsRoutingModule } from './promotions.routing';
import { PromotionsComponent } from './promotions.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PromotionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PromotionsRoutingModule
  ]
})
export class PromotionsModule { }