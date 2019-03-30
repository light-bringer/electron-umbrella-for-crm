import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Contact, Customer, TrustTag} from '@app/sales/shared/models';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DynamicFormModel} from '@app/dynamic-forms/angular-material/models/dynamic-form.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DynamicFormService} from '@app/dynamic-forms/angular-material/services/dynamic-form/dynamic-form.service';
import {DialogService} from '@app/custom-utility-components/services/dialogs/dialog.service';
import {MatDialog, MatDialogConfig, MatSnackBar} from '@angular/material';
import {LoggerService} from '@app/utils/services/logger/logger.service';
import {PouchdbService} from '@app/shared/services/pouchdb.service';
import {Location} from '@angular/common';
import {tap} from 'rxjs/operators';
import {ContactCampaignComponent} from '@app/sales/components/contact-campaign/contact-campaign.component';
import {CUSTOMER_INFORMATION_SLIM_FORM} from '@app/sales/shared/form-ids';
import {SnackBarComponent} from '@app/sales/components/customer/customer.component';

@Component({
  selector: 'crm-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss']
})
export class CreateContactComponent implements OnInit, OnDestroy {

  public containerHeight: number;

  public newCustomer = false;
  public id;
  public item: Customer;
  public viewCustomer = false;
  public trustTagValue = '';
  private comments;

  public discussionTextEmpty = false;
  public allowedSave = false;

  trustTagDoc = {} as TrustTag;
  contactDoc = {} as Contact;

  protected subscriptions: Subscription[] = [];

  @ViewChild('contentContainer')
  private tableContainer: ElementRef;

  public generalInformationGroup: FormGroup;
  public generalInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];

  public discussionForm: FormGroup;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private dynamicFormService: DynamicFormService,
              private dialogService: DialogService,
              private snackBar: MatSnackBar,
              private logger: LoggerService,
              private pouchdbService: PouchdbService,
              private dialog: MatDialog,
              public location: Location,
              private formBuilder: FormBuilder
              ) {
  }

  public ngOnInit() {

    this.logger.info('Create Contact Component: ngOnInit()');
    let paramSubscription: Subscription = new Subscription();
    this.subscriptions.push(paramSubscription);

    paramSubscription = this.route.paramMap.subscribe(params => {

      this.id = params.get('id');

      console.log(this.id);

      this.subscribe();

      this.discussionForm = this.formBuilder.group({
        discussionsTextCtrl: new FormControl('', [Validators.required])
      });

    });

  }

  protected subscribe() {

    this.logger.info('Create Contact Component: subscribe()');

    let formSubscription: Subscription = new Subscription();
    this.subscriptions.push(formSubscription);


    formSubscription = this.dynamicFormService.getFormMetadata(CUSTOMER_INFORMATION_SLIM_FORM).pipe(tap(() => {

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
      this.viewCustomer && this.generalInformationGroup.disable();
    });

  }

  protected unsubscribe(): void {

    this.logger.info('Create Contact Component: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngOnDestroy() {

    this.logger.info('Create Contact Component: ngOnDestroy()');
    this.unsubscribe();
  }

  public isValid() {
    let valid = false;
    if (this.generalInformationGroup && this.generalInformationGroup.valid) {
      valid = true;
    }
    return valid;
  }


  public onSave() {

    this.allowedSave = true;
    if (this.discussionForm.invalid) {
      return;
    }

      this.contactDoc.conversation = this.comments;
      // First delete all contacts and trusttags for the customer
      // Then save new Contact and Trusttag for that contact.
      this.pouchdbService.deleteContactsForCustomer(this.contactDoc.customer_id).then((deletedContacts) => {
        this.pouchdbService.deleteTrustTags(this.contactDoc.customer_id).then((deletedTrustTags) => {
          this.pouchdbService.saveDoc(this.contactDoc).then((res) => {
            this.trustTagDoc.contact_id = this.contactDoc._id;
            this.pouchdbService.saveDoc(this.trustTagDoc).then((result) => {
              this.openSnackBar();            });
          });
        });
      });

    this.allowedSave = false;

  }

  private openCreateOutboundContactModal() {
    this.discussionForm.get('discussionsTextCtrl').setValue('');
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      disableClose: false,
      data: {
        id: this.item._id,
        name: this.item.firstName,
        dateOfBirth: this.item.dateOfBirth,
        product: this.item.product,
        balance: this.item.balance,
        sharedFact: this.item.sharedKeyword
      }
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ContactCampaignComponent, dialogConfig);

    const camp = dialogRef.componentInstance.contactDataSavedEvent.subscribe((saved) => {
      this.trustTagDoc = saved.tagDoc;
      this.contactDoc = saved.ctDoc;
      this.trustTagValue = saved.tagDoc.trusttag;
      this.allowedSave = true;
    });

    dialogRef.afterClosed().subscribe(() => {
      camp.unsubscribe();
    });
  }

  get getForm() { return this.discussionForm.controls; }

  private openSnackBar() {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 500,
      panelClass: 'crm-snack-bar'
    });
  }
}
