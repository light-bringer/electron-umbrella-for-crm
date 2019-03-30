import {Component} from '@angular/core';

interface ROUTE {
  icon?: string;
  route?: string;
  title?: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  customerRoutes: ROUTE[] = [
    {
      icon: 'people',
      route: 'customers',
      title: 'Customers',
    },
    {
      icon: 'contacts',
      route: 'campaign',
      title: 'Campaigns',
    },
    {
      icon: 'account_box',
      route: 'administration',
      title: 'Administration',
    },
    {
      icon: 'dashboard',
      route: 'dashboards',
      title: 'Dashboard',
    }
  ];

  constructor() {}
}

