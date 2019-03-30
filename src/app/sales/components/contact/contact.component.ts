import {AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Contact} from '@app/sales/shared/models';
import {PouchdbService} from '@app/shared/services/pouchdb.service';
import {FormControl, FormGroup} from '@angular/forms';
import {map} from 'rxjs/operators';

export interface ContactToDisplay {
  customer_id: string;
  campaign_name: string;
  method: string;
  conversation: string;
  trusttag: string;
  created_at: string;
}


@Component({
  selector: 'crm-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit {

  public contactForm: FormGroup;

  public displayedColumns = ['campaign_name', 'method', 'trusttag', 'conversation', 'created_at'];
  public dataSource = new MatTableDataSource<Contact>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('contactDetails') contactDetails: TemplateRef<any>;

  @Input('id') customerId: string;
  @Input('refreshData') refreshData: any;

  noData = this.dataSource.connect().pipe(map(data => data.length === 0));

  constructor(private pouchdbService: PouchdbService, private dialog: MatDialog) { }

  ngOnInit() {
    this.contactForm = new FormGroup({
      campaignType: new FormControl(),
      contactMethod: new FormControl(),
      conversation: new FormControl()
    });
    this.getContacts(this.customerId);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  private getContacts(customerId: string) {



    this.pouchdbService.getContactsForCustomer(customerId).then((result) => {
      if (result != null && result.length > 0) {
        this.dataSource.data = result;
      }
    }).catch((err) => {
      this.dataSource.data = null;
    });


  }

  public onCancel() {
    this.dialog.closeAll();
  }

}
