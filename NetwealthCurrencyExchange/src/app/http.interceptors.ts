import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Environment } from "src/models/environment";

@Injectable()
export class HttpAddApiKeyInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const headers = new HttpHeaders().set('x-functions-key', (<Environment>environment).apiKey);
      request = request.clone({ headers });
      return next.handle(request);
    }
}
