import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CampaignComponent} from '@app/sales/components/campaign/campaign.component';

const routes: Routes = [
  {
    path: '**',
    component: CampaignComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes  /*, { enableTracing: true }*/)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
