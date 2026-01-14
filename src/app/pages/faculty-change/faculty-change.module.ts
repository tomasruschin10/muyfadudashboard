import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacultyChangeRoutingModule } from './faculty-change-routing.module';
import { FacultyChangeComponent } from './faculty-change.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    FacultyChangeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FacultyChangeRoutingModule
  ],
})
export class FacultyChangeModule { }