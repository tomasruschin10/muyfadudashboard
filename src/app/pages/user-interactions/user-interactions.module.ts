import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserInteractionComponent } from './user-interactions.component';
import { UserInteractionRoutingModule } from './user-interactions.routing';

@NgModule({
  declarations: [
    UserInteractionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserInteractionRoutingModule
  ]
})
export class UserInteractionModule { }