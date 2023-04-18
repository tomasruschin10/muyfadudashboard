import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeCareerComponent } from './college-career.component';

const routes: Routes = [{
  path: '', component: CollegeCareerComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeCareerRoutingModule { }
