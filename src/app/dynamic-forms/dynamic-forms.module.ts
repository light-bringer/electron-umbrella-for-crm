import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {DynamicFormsConfig} from './shared/models';
import {DynamicFormsConfigService} from './services/config.service';

import {AngularMaterialModule} from './shared/angular-material.module';

import {DynamicControlDirective} from './angular-material/directives/dynamic-control/dynamic-control.directive';
import {DynamicFormComponent} from './angular-material/containers/dynamic-form/dynamic-form.component';

import {DynamicDatepickerComponent} from './angular-material/components/dynamic-datepicker/dynamic-datepicker.component';
import {DynamicInputComponent} from './angular-material/components/dynamic-input/dynamic-input.component';
import {UtilsModule} from '@app/utils/utils.module';
import {LoggerService} from '@app/utils/services/logger/logger.service';
import {ConsoleLoggerService} from '@app/utils/services/logger/console-logger.service';
import {DynamicSelectComponent} from '@app/dynamic-forms/angular-material/components/select/select.component';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    UtilsModule
    ],
  declarations: [
    DynamicControlDirective,
    DynamicFormComponent,
    DynamicDatepickerComponent,
    DynamicInputComponent,
    DynamicSelectComponent
  ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [
    DynamicFormComponent
  ],
  entryComponents: [
    DynamicDatepickerComponent,
    DynamicInputComponent,
    DynamicSelectComponent
  ]
})
export class DynamicFormsModule {

  static forRoot(config: DynamicFormsConfig): ModuleWithProviders {

    return {
      ngModule: DynamicFormsModule,
      providers: [
        { provide: DynamicFormsConfigService, useValue: config }
      ]
    };

  }

}
