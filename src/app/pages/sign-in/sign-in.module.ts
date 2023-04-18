import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignInRoutingModule } from './sign-in.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    SharedModule,
    SignInRoutingModule,
    NgbModule
  ],
  providers: []
})
export class SignInModule { }
