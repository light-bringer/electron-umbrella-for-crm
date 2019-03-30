import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ServiceWorkerModule} from '@angular/service-worker';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {FlexLayoutModule} from '@angular/flex-layout';
// The Angular Material module must be imported after Angular's BrowserModule, as the import order matters for NgModules.
import {MAT_DATE_LOCALE} from '@angular/material';
import {NavigationBarComponent} from './components/navigation-bar/navigation-bar.component';
import {NavComponent} from './components/nav/nav.component';
import {environment} from '@env/environment';
import {throwIfAlreadyLoaded} from './module-import-guard';
import {SalesModule} from '@app/sales/sales.module';
import {UtilsModule} from '@app/utils/utils.module';
import {LoggerService} from '@app/utils/services/logger/logger.service';
import {ConsoleLoggerService} from '@app/utils/services/logger/console-logger.service';
import {DynamicFormsModule} from '@app/dynamic-forms/dynamic-forms.module';
import {AngularMaterialModule} from '@app/custom-utility-components/shared/angular-material.module';


@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    UtilsModule.forRoot(environment),
    DynamicFormsModule.forRoot(environment),
    SalesModule,
    RouterModule  // There is no directive with "exportAs" set to "routerLinkActive ...
  ],
  declarations: [ NavigationBarComponent, NavComponent ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: environment.defaultLanguage },
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ NavigationBarComponent, NavComponent ] // TranslateModule
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule, private logger: LoggerService) {

    this.logger.info('Core Module initialised');
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
