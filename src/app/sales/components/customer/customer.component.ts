import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MatDialog, MatDialogConfig, MatSnackBar} from '@angular/material';
import {Customer} from '../../shared/models';
import {CUSTOMER_INFORMATION_FORM} from '../../shared/form-ids';
import {LoggerService} from '@app/utils/services/logger/logger.service';
import {PouchdbService} from '@app/shared/services/pouchdb.service';
import {Guid} from 'guid-typescript';
import {DynamicFormModel} from '@app/dynamic-forms/angular-material/models/dynamic-form.model';
import {DynamicFormService} from '@app/dynamic-forms/angular-material/services/dynamic-form/dynamic-form.service';
import {DynamicFormControlCustomEvent} from '@app/dynamic-forms/angular-material/models/dynamic-form-control.model';
import {DialogService} from '@app/custom-utility-components/services/dialogs/dialog.service';
import {ContactCampaignComponent} from '@app/sales/components/contact-campaign/contact-campaign.component';
import { Location } from '@angular/common';

@Component({
  selector: 'sales-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy {

  public containerHeight: number;

  public newCustomer = false;
  public id;
  public item: Customer;
  public viewCustomer = false;
  public action;
  public editCustomer = false;

  protected subscriptions: Subscription[] = [];

  @ViewChild('contentContainer')
  private tableContainer: ElementRef;

  public generalInformationGroup: FormGroup;
  public generalInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];

  public contactDataSaved = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dynamicFormService: DynamicFormService,
              private dialogService: DialogService,
              private snackBar: MatSnackBar,
              private logger: LoggerService,
              private pouchdbService: PouchdbService,
              public location: Location) {
  }

  public ngOnInit() {

    this.logger.info('CustomerComponent: ngOnInit()');


    let paramSubscription: Subscription = new Subscription();
    this.subscriptions.push(paramSubscription);

    paramSubscription = this.route.paramMap.subscribe(params => {

      this.id = params.get('id');
      this.action = params.get('action');

      if (this.id === 'new') {
        this.newCustomer = true;
      }
      if (this.action === 'view') {
        this.viewCustomer = true;
      }
      if (this.action === 'edit') {
        this.editCustomer = true;
      }
      this.subscribe();
    });
  }

  protected subscribe() {

    this.logger.info('CustomerComponent: subscribe()');
    let formSubscription: Subscription = new Subscription();
    this.subscriptions.push(formSubscription);

    formSubscription = this.dynamicFormService.getFormMetadata(CUSTOMER_INFORMATION_FORM).pipe(tap(() => {

      if (!this.newCustomer) {

        let modelSubscription: Subscription = new Subscription();
        this.subscriptions.push(modelSubscription);

        modelSubscription = this.pouchdbService.getCustomer(this.id).then((data) => {
          this.item = data;
          this.dynamicFormService.initGroup(this.generalInformationGroup, this.item);
        }).catch((error) => {
          console.log(error);
        });
      }

    })).subscribe(metaData => {

      this.generalInformationModel = metaData;
      this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);
      // this.viewCustomer && this.generalInformationGroup.disable();
    });

    if (this.newCustomer) {

      this.logger.info('CustomerComponent: subscribe() - this.item = {} as Customer');
      this.item = {} as Customer;
    }

  }

  protected unsubscribe(): void {

    this.logger.info('CustomerComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngOnDestroy() {

    this.logger.info('CustomerComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  public isValid() {
    let valid = false;
    if (this.generalInformationGroup && this.generalInformationGroup.valid) {
      valid = true;
    }

    return valid;
  }

  public onNew() {

    this.logger.info('CustomerPage: onNew()');

    this.router.navigate(['customers/new']);
  }

  public onSave() {

    if (this.editCustomer) {
      this.onEditCustomer();
    } else {

      this.logger.info('Customer: onSave()');

      this.generalInformationGroup.patchValue({
        _id: `customer_${Guid.create().toString()}`,
        entity: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      console.log(this.generalInformationGroup);

      this.pouchdbService.saveDoc(this.generalInformationGroup.value).then((result) => {
        this.openSnackBar();
        this.router.navigate(['customers']);
      });
    }

  }


  private onEditCustomer() {
    this.logger.info('Customer: Editing()');
    const docId = this.generalInformationGroup.get('_id').value;
    this.editCustomer && this.pouchdbService.getCustomer(docId).then((doc) => {
      doc.firstName = this.generalInformationGroup.get('firstName').value;
      doc.lastName = this.generalInformationGroup.get('lastName').value;
      doc.gender = this.generalInformationGroup.get('gender').value;
      doc.dateOfBirth = this.generalInformationGroup.get('dateOfBirth').value;
      doc.telephone = this.generalInformationGroup.get('telephone').value;
      doc.mobile = this.generalInformationGroup.get('mobile').value;
      doc.email = this.generalInformationGroup.get('email').value;
      doc.addressLine1 = this.generalInformationGroup.get('addressLine1').value;
      doc.addressLine2 = this.generalInformationGroup.get('addressLine2').value;
      doc.city = this.generalInformationGroup.get('city').value;
      doc.postcode = this.generalInformationGroup.get('postcode').value;
      doc.county = this.generalInformationGroup.get('county').value;
      doc.product = this.generalInformationGroup.get('product').value;
      doc.balance = this.generalInformationGroup.get('balance').value;
      doc.sharedKeyword = this.generalInformationGroup.get('sharedKeyword').value;
      doc.updated_at = new Date();

      this.pouchdbService.saveDoc(doc).then((result) => {
        this.openSnackBar();
        this.router.navigate(['customers']);
      });

    }).catch((err) => {
      console.log(err);
    });
  }

  public onCustomEvent(event: DynamicFormControlCustomEvent) {
    this.logger.info('CustomerPage: onCustomEvent()');
    this.dialogService.openAlert({
      title: 'Alert',
      message: JSON.stringify(event),
      closeButton: 'CLOSE'
    });

  }

  private openSnackBar() {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 500,
      panelClass: 'crm-snack-bar'
    });
  }

}

@Component({
  selector: 'sales-toast',
  template: `
    <span>
      Operation done!
    </span>
  `,
  styles: []
})
export class SnackBarComponent {
}

