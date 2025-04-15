import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ForumComponent } from './forum.component';
import { ForumRoutingModule } from './forum-routing.module';


@NgModule({
  declarations: [
    ForumComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ForumRoutingModule
  ]
})
export class ForumModule { }
