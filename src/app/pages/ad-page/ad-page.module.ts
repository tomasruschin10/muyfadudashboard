import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdPageRoutingModule } from './ad-page.routing';
import { AdPageComponent } from './ad-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AdPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    AdPageRoutingModule
  ]
})
export class AdPageModule { }
