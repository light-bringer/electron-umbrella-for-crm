import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {PouchdbService} from '@app/shared/services/pouchdb.service';
import {environment} from '@env/environment';


@Component({
  selector: 'crm-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements AfterViewInit, OnInit {

  jwtToken: any;
  password: string;
  show = false;
  showHideLabel = 'Show';

  constructor(private snackBar: MatSnackBar, private pouchDbService: PouchdbService) {
    this.init();
    this.password = environment.apiPassword;
  }

  ngOnInit(): void {
  }


  init() {
    this.jwtToken = this.pouchDbService.gwtToken;
    console.log(this.jwtToken);
  }

  public ngAfterViewInit() {

  }

  public cleanEverything() {

    this.pouchDbService.destroyDatabase().then((result) => {
      this.snackBar.open(JSON.stringify(result), '', {
        duration: 1000,
      });
    }).catch((err) => {
      this.snackBar.open(JSON.stringify(err), '', {
        duration: 1000,
      });

    });
  }

  public seedCustomerData() {
    this.pouchDbService.seedCustomerData().then((result) => {
      this.snackBar.open(JSON.stringify(result), '', {
        duration: 1000,
      });
    }).catch((err) => {
      this.snackBar.open(JSON.stringify(err), '', {
        duration: 1000,
      });

    });
  }

  public seedCampaignData() {
    this.pouchDbService.seedCampaignData().then((result) => {
      this.snackBar.open(JSON.stringify(result), '', {
        duration: 1000,
      });
    }).catch((err) => {
      this.snackBar.open(JSON.stringify(err), '', {
        duration: 1000,
      });

    });
  }

  public showHidePassword() {
    this.show = !this.show;
    if (this.show) {
      this.showHideLabel = 'Hide';
    } else {
      this.showHideLabel = 'Show';
    }
  }

}
