import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeCareerRoutingModule } from './college-career.routing';
import { CollegeCareerComponent } from './college-career.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CollegeCareerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    CollegeCareerRoutingModule
  ]
})
export class CollegeCareerModule { }
