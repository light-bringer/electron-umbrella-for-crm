import { Inject, Injectable } from '@angular/core';

import { Logger } from './logger';

import { UtilsConfig } from '../../shared/models';
import { UtilsConfigService } from '../config.service';

const noop = (): any => undefined;

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService implements Logger {

  constructor(@Inject(UtilsConfigService) private config: UtilsConfig) {

    if (this.config.isDebugMode) {
      console.log('Console Logger Service registered');
    }

  }

  get info() {
    if (this.config.isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (this.config.isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (this.config.isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

}
