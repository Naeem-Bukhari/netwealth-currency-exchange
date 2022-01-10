import { Environment } from './../../../models/environment';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, EMPTY, map, Observable, switchMap } from "rxjs";
import * as FromAppActions from '../actions/app.actions';
import { Exchange, Exchanged } from "../actions/app.actions";

@Injectable()
export class AppEffects {
  exchangeCurrency$ = createEffect(() => this.actions$.pipe(
    ofType(FromAppActions.exchangeCurrency),
    switchMap(({type, ...exchange}) => this.callSafely<Exchanged>(environment.url, exchange)),
    map((exchanged: Exchanged) => FromAppActions.updateExchange(exchanged))
  ));

  constructor(private httpClient: HttpClient, private actions$: Actions) {}

  callSafely<T>(url: string, exchange: Exchange): Observable<T> {
    return this.httpClient.post<T>(url, exchange).pipe(
      catchError(err => {
        console.log('failed to call server endpoint', err);
        return EMPTY;
      })
    )
  }

}
