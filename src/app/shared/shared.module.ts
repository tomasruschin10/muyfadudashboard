import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { UsersComponent } from './components/users/users.component';
import { OffersComponent } from './components/offers/offers.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports:      [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    RouterModule
    ],
  declarations: [
    UsersComponent,
    OffersComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    UsersComponent,
    OffersComponent
  ],
  providers: [
    TranslatePipe

  ]
})
export class SharedModule { }
