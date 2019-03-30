import { NgModule, ModuleWithProviders } from '@angular/core';

import { UtilsConfig } from './shared/models';
import { UtilsConfigService } from './services/config.service';

import { StaticInjectorService } from './services/injector/static-injector.service';

@NgModule()
export class UtilsModule {

  constructor(private staticInjector: StaticInjectorService) {
  }

  static forRoot(config: UtilsConfig): ModuleWithProviders {

    // ng build --prod
    // ERROR in Error during template compile of 'CoreModule'
    // Function calls are not supported in decorators but 'UtilsModule' was called.
    // console.log('UtilsModule: forRoot()');
    // console.log(JSON.stringify(config));

    return {
      ngModule: UtilsModule,
      providers: [
        { provide: UtilsConfigService, useValue: config }
      ]
    };

  }

}
