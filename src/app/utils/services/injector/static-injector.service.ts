import { Inject, Injectable, Injector } from '@angular/core';

import { UtilsConfig } from '../../shared/models';
import { UtilsConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class StaticInjectorService {

  private static injector: Injector = null;

  constructor(@Inject(UtilsConfigService) private config: UtilsConfig ) {

    if (this.config.isDebugMode) {
      console.log('Static Injector Service registered');
    }

  }

  static setInjector(injector: Injector) {

    StaticInjectorService.injector = injector;
  }

  static getInjector(): Injector {
    return StaticInjectorService.injector;
  }

}
