import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { FacultiesComponent } from './faculties.component';
import { FacultiesRoutingModule } from './faculties-routing.module';


@NgModule({
  declarations: [
    FacultiesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FacultiesRoutingModule
  ]
})
export class FacultiesModule { }