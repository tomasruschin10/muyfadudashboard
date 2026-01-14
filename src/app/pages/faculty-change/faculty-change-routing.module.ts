import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacultyChangeComponent } from './faculty-change.component';

const routes: Routes = [
  {
    path: '',
    component: FacultyChangeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacultyChangeRoutingModule { }