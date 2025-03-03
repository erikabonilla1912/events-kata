import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export function apiKeyInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const apiKey = environment.apiKey;
  const apiReq = req.clone({
    setHeaders: {
      'x-api-key': apiKey
    }
  });
  return next(apiReq);
}
