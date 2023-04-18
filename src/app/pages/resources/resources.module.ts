import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesRoutingModule } from './resources.routing';
import { ResourcesComponent } from './resources.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ResourcesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    ResourcesRoutingModule
  ]
})
export class ResourcesModule { }
