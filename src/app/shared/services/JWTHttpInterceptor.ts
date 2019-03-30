import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GoverifyService} from '@app/shared/services/goverify.service';

@Injectable()
export class JWTHttpInterceptor implements HttpInterceptor {

  constructor(private goVerifyService: GoverifyService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.goVerifyService.gwtToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.goVerifyService.gwtToken}`
        }
      });
      request.headers.append('Content-Type', 'application/json');
    }
    return next.handle(request);
  }
}
