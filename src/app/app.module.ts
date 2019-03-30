import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {PouchdbService} from '@app/shared/services/pouchdb.service';
import {JWTHttpInterceptor} from '@app/shared/services/JWTHttpInterceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {GoverifyService} from '@app/shared/services/goverify.service';

export function loadDB(pouchDbService: PouchdbService) {
  return () => {
    return pouchDbService.loadDB();
  };
}


@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule
  ],
  declarations: [ AppComponent ],
  providers: [
    PouchdbService,
    GoverifyService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadDB,
      deps: [PouchdbService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS,
      useClass: JWTHttpInterceptor,
      multi: true
    },
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

  constructor() {
  }

}
