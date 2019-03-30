import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {Campaign} from '@app/sales/shared/models';
import {PouchdbService} from '@app/shared/services/pouchdb.service';
import {map} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Guid} from 'guid-typescript';
import {SnackBarComponent} from '@app/sales/components/customer/customer.component';

@Component({
  selector: 'crm-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit, AfterViewInit {

  public displayedColumns = ['name', 'description', 'telephone', 'email', 'created_at', 'action'];
  public dataSource = new MatTableDataSource<Campaign>();
  noData = this.dataSource.connect().pipe(map(data => data.length === 0));

  campaignForm: FormGroup;
  campaignEditForm: FormGroup;

  forEdit: Boolean = false;

  @ViewChild('newCampaignDialog') newCampaignDialog: TemplateRef<any>;
  @ViewChild('campaignDetails') campaignDetails: TemplateRef<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: FormBuilder,
              private pouchDbService: PouchdbService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {

  }


  ngOnInit(): void {
    this.pouchDbService.db != null && this.getCampaigns();
    this.campaignForm = this.formBuilder.group({
      _id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(),
      telephone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      email: new FormControl('', [Validators.required])
    });
    this.campaignEditForm = this.formBuilder.group({
      _id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(),
      telephone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      email: new FormControl('', [Validators.required])
    });
  }

  ngAfterViewInit(): void {
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public onNew() {
    console.log('New campaign. Opening campaign modal.');
    this.campaignForm.enable();
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      disableClose: false,
      data: {}
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(this.newCampaignDialog, dialogConfig);
  }

  private getCampaigns() {
    this.pouchDbService.getCampaigns().then((result) => {
      this.dataSource.data = result.docs;
    });
  }

  save() {
    const campaign = {} as Campaign;
    campaign._id = `campaign_${Guid.create().toString()}`;
    campaign.entity = 'campaign';
    campaign.name = this.campaignForm.get('name').value;
    campaign.description = this.campaignForm.get('description').value;
    campaign.telephone = this.campaignForm.get('telephone').value;
    campaign.email = this.campaignForm.get('email').value;
    campaign.created_at = campaign.updated_at = new Date().toDateString();

    this.pouchDbService.saveDoc(campaign).then((result) => {
      this.openSnackBar();
    });

    this.dialog.closeAll();
    this.campaignForm.reset();
    this.pouchDbService.db != null && this.getCampaigns();
  }

  editSave() {
    const campId = this.campaignEditForm.get('_id').value;
    this.pouchDbService.getCampaign(campId).then((doc) => {
      console.log(JSON.stringify(this.campaignEditForm.value));
      doc.name = this.campaignEditForm.get('name').value;
      doc.description = this.campaignEditForm.get('description').value;
      doc.telephone = this.campaignEditForm.get('telephone').value;
      doc.email = this.campaignEditForm.get('email').value;
      doc.updated_at = new Date();
      this.pouchDbService.saveDoc(doc).then((result) => {
        this.openSnackBar();
      });
    }).catch((err) => {
      console.log(err);
    });

    this.dialog.closeAll();
    this.campaignForm.reset();
    this.pouchDbService.db != null && this.getCampaigns();
  }

  close() {
    this.dialog.closeAll();
    this.campaignForm.reset();
  }

  private openSnackBar() {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 500,
      panelClass: 'crm-snack-bar'
    });
  }

  private showCampaign(id: any) {
    this.getCampaignData(id);
    this.openDialog();
    this.campaignEditForm.disable();
  }

  private editCampaign(id: any) {
    this.campaignEditForm.enable();
    this.getCampaignData(id);
    this.openDialog();
  }

  private openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      disableClose: false,
      data: {}
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(this.campaignDetails, dialogConfig);
  }

  private getCampaignData(id: any) {
    this.pouchDbService.getCampaign(id).then((result) => {
      this.campaignEditForm.setValue({
        _id: result._id,
        name: result.name,
        description: result.description,
        telephone: result.telephone,
        email: result.email
      });
    });
  }

  public onCancel() {
    this.dialog.closeAll();
  }

  public removeCampaign(id: any) {
    return this.pouchDbService.getCampaign(id).then((doc) => {
      this.pouchDbService.removeCampaign(doc).then((result => {
        this.pouchDbService.db != null && this.getCampaigns();
      })).catch((err) => {
        return err;
      });
    });
  }
}
