import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeRoutingModule } from './notice.routing';
import { NoticeComponent } from './notice.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    NoticeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    NoticeRoutingModule
  ]
})
export class NoticeModule { }
