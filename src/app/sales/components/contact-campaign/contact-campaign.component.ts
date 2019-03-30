import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Campaign, Contact, TrustTag} from '@app/sales/shared/models';
import {PouchdbService} from '@app/shared/services/pouchdb.service';
import {Guid} from 'guid-typescript';
import {GoverifyService} from '@app/shared/services/goverify.service';
import {environment} from '@env/environment';

@Component({
  selector: 'crm-contact-campaign',
  templateUrl: './contact-campaign.component.html',
  styleUrls: ['./contact-campaign.component.scss']
})
export class ContactCampaignComponent implements OnInit {

  public contactForm: FormGroup;
  public selectedCampaign: any;
  public selectedContactMethod: any;
  public selectedKnownFact: any;

  existingCampaigns: Campaign[];
  name: string;

  @Output() contactDataSavedEvent = new EventEmitter();
  @Output() trustTagValue = new EventEmitter();

  trustTag: any;

  trustTagDoc = {} as TrustTag;

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<ContactCampaignComponent>,
              @Inject(MAT_DIALOG_DATA) public customerData: any,
              private goVerifyService: GoverifyService, private pouchDbService: PouchdbService) {
  }

  ngOnInit() {
    this.contactForm = new FormGroup({
      campaignType: new FormControl(),
      contactMethod: new FormControl(),
      selectedKnownFact: new FormControl(),
      comments: new FormControl(),
    });

    this.name = this.customerData.name;
    this.getCampaigns();
  }

  public onCancel() {
    this.dialogRef.close();
  }


  public callGoVerifyAndSaveData(event: any) {
    const compaignType = this.contactForm.get('campaignType').value;

    this.goVerifyService.createTrustTag(
      compaignType.id,
      this.contactForm.get('selectedKnownFact').value
      ).subscribe((data) => {
      this.trustTag = data.minified;
      // Prepare TrustTag to save
      this.trustTagDoc._id = `trusttag_${Guid.create().toString()}`;
      this.trustTagDoc.entity = 'trusttag';
      this.trustTagDoc.sharedFactType = this.contactForm.get('selectedKnownFact').value;
      this.trustTagDoc.trusttag = this.trustTag;
      this.trustTagDoc.customer_id = this.customerData.id;
      this.trustTagDoc.created_at = new Date().toISOString();
      this.trustTagDoc.updated_at = new Date().toISOString();

      // now save outbound contact data
      const contactDoc = {} as Contact;
      contactDoc._id = `contact_${Guid.create().toString()}`;
      contactDoc.entity = 'contact';
      contactDoc.campaign_name = compaignType.name;
      contactDoc.conversation = this.contactForm.get('comments').value;
      contactDoc.method = this.contactForm.get('contactMethod').value;
      contactDoc.customer_id = this.customerData.id;
      contactDoc.created_at = new Date().toISOString();
      contactDoc.updated_at = new Date().toISOString();

      this.contactDataSavedEvent.emit({ tagDoc: this.trustTagDoc, ctDoc: contactDoc});
      this.trustTagValue.emit(this.trustTag);
      this.dialogRef.close();
    });
  }

  private getCampaigns() {
    this.goVerifyService.getOrganisation().subscribe((data) => {
      this.existingCampaigns = data.campaigns;
    });
  }
}
