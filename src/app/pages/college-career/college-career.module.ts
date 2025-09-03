import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeCareerRoutingModule } from './college-career.routing';
import { CollegeCareerComponent } from './college-career.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  declarations: [
    CollegeCareerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    CollegeCareerRoutingModule,
    ComponentsModule
]
})
export class CollegeCareerModule { }
