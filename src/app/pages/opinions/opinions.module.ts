import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpinionsRoutingModule } from './opinions.routing';
import { OpinionsComponent } from './opinions.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    OpinionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OpinionsRoutingModule
  ]
})
export class OpinionsModule { }
