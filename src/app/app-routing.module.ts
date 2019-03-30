import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from '@app/sales/components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '**',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes  /*, { enableTracing: true }*/)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
