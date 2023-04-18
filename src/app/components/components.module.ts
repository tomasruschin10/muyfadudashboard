import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent as AuthHeaderComponent } from './auth/header/header.component';
import { FooterComponent as AuthFooterComponent } from './auth/footer/footer.component';
import { HeaderComponent as DashHeaderComponent } from './dash/header/header.component';
import { FooterComponent as DashFooterComponent } from './dash/footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuLeftComponent } from './dash/menu-left/menu-left.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  declarations: [
    AuthFooterComponent,
    AuthHeaderComponent,
    DashFooterComponent,
    DashHeaderComponent,
    MenuLeftComponent,
  ],
  exports: [
    AuthFooterComponent,
    AuthHeaderComponent,
    DashFooterComponent,
    DashHeaderComponent,
    MenuLeftComponent
  ],
  providers: []
})
export class ComponentsModule { }
