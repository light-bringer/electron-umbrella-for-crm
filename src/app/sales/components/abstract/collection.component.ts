import { Injector, OnInit, OnDestroy, Type } from '@angular/core';

import { Subscription} from 'rxjs';

import {LoggerService} from '@app/utils/services/logger/logger.service';

import { FAKE_ITEMS_LENGTH } from '../../shared/constants';
import {StaticInjectorService} from '@app/utils/services/injector/static-injector.service';


export abstract class CollectionComponent implements OnInit, OnDestroy {

  protected fakeItems: Array<any> = new Array(FAKE_ITEMS_LENGTH);

  protected logger: LoggerService;

  protected subscription: Subscription;

  constructor() {

    const injector: Injector = StaticInjectorService.getInjector();

    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
  }

  public ngOnInit() {

    this.logger.info('CollectionComponent: ngOnInit()');
    this.subscribe();
  }

  protected subscribe() {
    this.logger.info('CollectionComponent: subscribe()');
  }

  protected unsubscribe() {

    this.logger.info('CollectionComponent: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public ngOnDestroy() {

    this.logger.info('CollectionComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

}
