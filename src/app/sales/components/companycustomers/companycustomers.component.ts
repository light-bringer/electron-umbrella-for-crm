import {Component, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import {map} from 'rxjs/operators';
import {PouchdbService} from '@app/shared/services/pouchdb.service';
import {Customer} from '@app/sales/shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarComponent} from '@app/sales/components/customer/customer.component';

@Component({
  selector: 'crm-companycustomers',
  templateUrl: './companycustomers.component.html',
  styleUrls: ['./companycustomers.component.scss']
})
export class CompanycustomersComponent implements OnInit {
  displayedColumns: string[] = [ 'firstName', 'lastName', 'email',  'mobile', 'action'];
  dataSource = new MatTableDataSource<Customer>();
  noData = this.dataSource.connect().pipe(map(data => data.length === 0));

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private pouchdbService: PouchdbService, private route: ActivatedRoute,
              private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {

    this.pouchdbService.db != null && this.getAllCustomers();
    this.dataSource.paginator = this.paginator;
  }

  removeCustomer(id: any) {
    console.log(id);
    return this.pouchdbService.getCustomer(id).then((doc) => {
      this.pouchdbService.removeCustomer(doc).then((result => {
        this.openSnackBar();
        this.pouchdbService.db != null && this.getAllCustomers();
      })).catch((err) => {
        return err;
      });
    });
  }

  private openSnackBar() {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 500,
      panelClass: 'crm-snack-bar'
    });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  private getAllCustomers() {
    this.pouchdbService.getAllCustomers().then((result) => {
      this.dataSource.data = result.docs;
    });
  }

  public onNew() {
    this.router.navigate(['customers/new/new']);
  }
}
