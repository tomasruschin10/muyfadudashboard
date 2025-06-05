import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInteractionComponent } from './user-interactions.component';

const routes: Routes = [
  {
    path: '',
    component: UserInteractionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserInteractionRoutingModule { }