import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceRoutingModule } from './balance-routing.module';
import { BalanceComponent } from './balance.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    BalanceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    BalanceRoutingModule,
  ]
})
export class BalanceModule { }
