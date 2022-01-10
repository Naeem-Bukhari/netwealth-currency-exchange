import { TestBed } from '@angular/core/testing';
import { AppEffects } from "./app.effects";
import * as FromAppActions from '../actions/app.actions';
import { RunHelpers, TestScheduler } from "rxjs/testing";
import { Mock } from 'ts-mocks';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { environment } from 'src/environments/environment';

describe('App Effects', () => {
  let appEffects: AppEffects;
  let testScheduler: TestScheduler;
  let httpClient: Mock<HttpClient>;
  let action$: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AppEffects, provideMockActions(() => action$)]
    });
  })

  beforeEach(() => testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected)));

  fit(`should call server endpoint to exchange currency and update state when action: ${FromAppActions.exchangeCurrency.type} is dispatched`, () => {
    //arrange
    const exchanged: FromAppActions.Exchanged = {
      sourceCurrency: 'GBP',
      destinationCurrency: 'USD',
      amountToConvert: 1000,
      convertedAmount: 1200
    };
    const {convertedAmount, ...exchangeCurrency} = exchanged;
    testScheduler.run(({expectObservable, hot, cold}: RunHelpers) => {

      httpClient = new Mock<HttpClient>()
        .setup(x => x.post)
        .is(() => cold('a', {a: <any>exchanged})) //<any> required due to ts-mocks not working well with generics
      action$ = hot('a', {a: FromAppActions.exchangeCurrency(exchangeCurrency)})
      const expectedResult = hot('a', {a: FromAppActions.updateExchange(exchanged) });

      //act
      appEffects = TestBed.inject(AppEffects);

      //assert
      expectObservable(appEffects.exchangeCurrency$).toEqual(expectedResult);
    });
    expect(httpClient.Object.post).toHaveBeenCalledWith(environment.url, exchangeCurrency);
  });
})
