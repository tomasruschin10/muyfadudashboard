import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalsRoutingModule } from './modals.routing';
import { ModalsComponent } from './modals.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ModalsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalsRoutingModule
  ]
})
export class ModalsModule { }