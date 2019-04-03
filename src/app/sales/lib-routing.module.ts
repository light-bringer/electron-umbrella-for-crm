import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomerComponent} from './components/customer/customer.component';
import {CampaignComponent} from '@app/sales/components/campaign/campaign.component';
import {ContactComponent} from '@app/sales/components/contact/contact.component';
import {AdministrationComponent} from '@app/sales/components/administration/administration.component';
import {CompanycustomersComponent} from '@app/sales/components/companycustomers/companycustomers.component';
import {CreateContactComponent} from '@app/sales/components/contact/create-contact.component';
//import {DashBoardComponent} from '@app/sales/components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'administration',
    component: AdministrationComponent
  },
  {
    path: 'campaign',
    component: CampaignComponent
  },
  {
    path: 'campaign/:id',
    component: CampaignComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'contact/:id',
    component: ContactComponent
  },
  {
    path: 'customers',
    component: CompanycustomersComponent
  },
  {
    path: 'customers/:id/:action',
    component: CustomerComponent
  },
  {
    path: 'create-contact/:id',
    component: CreateContactComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibRoutingModule {
}
