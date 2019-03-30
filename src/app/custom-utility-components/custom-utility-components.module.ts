import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './shared/angular-material.module';
import { AlertDialogComponent } from './components/dialogs/alert-dialog/alert-dialog.component';
import { CommandBarComponent } from './components/command-bar/command-bar.component';
import {UtilsModule} from '@app/utils/utils.module';
import {LoggerService} from '@app/utils/services/logger/logger.service';
import {ConsoleLoggerService} from '@app/utils/services/logger/console-logger.service';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    UtilsModule
  ],
  declarations: [ AlertDialogComponent, CommandBarComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ CommandBarComponent ],
  entryComponents: [ AlertDialogComponent ]
})
export class CustomUtilityComponentsModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Components Module initialised');
  }

}
