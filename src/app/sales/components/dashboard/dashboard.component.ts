import { Component, OnInit } from '@angular/core';
import {PouchdbService} from '@app/shared/services/pouchdb.service';

let customers = [
  {
    'name': 'Customers',
    'value': 7
  }
];

let campaigns = [
  {
    'name': 'Campaigns',
    'value': 15
  }
];

@Component({
  selector: 'sales-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  smallView: any[] = [322, 200];

  accountsColorScheme = {
    domain: ['#e8eaed']  // #2196F3
  };

  contactsColorScheme = {
    domain: ['#e8eaed']  // #03A9F4
  };

  constructor(private pouchDbService: PouchdbService) {

    Object.assign(this, {
      customers,
      campaigns
    });

  }

  ngOnInit() {
  }

  onSelect(event) {
  }

}
