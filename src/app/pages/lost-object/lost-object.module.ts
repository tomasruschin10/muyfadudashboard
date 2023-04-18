import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LostObjectRoutingModule } from './lost-object.routing';
import { LostObjectComponent } from './lost-object.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    LostObjectComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LostObjectRoutingModule
  ]
})
export class LostObjectModule { }
