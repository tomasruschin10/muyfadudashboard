import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ActionComponent } from './actions.component';
import { ActionRoutingModule } from './actions-routing.module';


@NgModule({
  declarations: [
    ActionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ActionRoutingModule
  ]
})
export class ActionModule { }
