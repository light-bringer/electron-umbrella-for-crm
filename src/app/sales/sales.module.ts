import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularMaterialModule} from './shared/angular-material.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {CustomerComponent, SnackBarComponent} from './components/customer/customer.component';
import {LibRoutingModule} from './lib-routing.module';
import {UtilsModule} from '@app/utils/utils.module';
import {LoggerService} from '@app/utils/services/logger/logger.service';
import {ConsoleLoggerService} from '@app/utils/services/logger/console-logger.service';
import {StaticInjectorService} from '@app/utils/services/injector/static-injector.service';
import {DynamicFormsModule} from '@app/dynamic-forms/dynamic-forms.module';
import {CustomUtilityComponentsModule} from '@app/custom-utility-components/custom-utility-components.module';
import {CampaignComponent} from './components/campaign/campaign.component';
import {ContactComponent} from './components/contact/contact.component';
import {AdministrationComponent} from './components/administration/administration.component';
import {ContactCampaignComponent} from './components/contact-campaign/contact-campaign.component';
import {CompanycustomersComponent} from './components/companycustomers/companycustomers.component';
import { CreateContactComponent } from './components/contact/create-contact.component';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxChartsModule,
    UtilsModule,
    CustomUtilityComponentsModule,
    DynamicFormsModule,
    LibRoutingModule  // https://angular.io/guide/router#routing-module-order
  ],
  declarations: [
    CustomerComponent,
    SnackBarComponent,
    CampaignComponent,
    ContactComponent,
    AdministrationComponent,
    ContactCampaignComponent,
    CompanycustomersComponent,
    CreateContactComponent
  ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [
    CustomerComponent,
    SnackBarComponent,
    CampaignComponent
  ],
  entryComponents: [ SnackBarComponent, ContactCampaignComponent ]
})
export class SalesModule {

  constructor(private injector: Injector, private logger: LoggerService) {
    StaticInjectorService.setInjector(injector);
  }

}
