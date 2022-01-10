import { RunHelpers, TestScheduler } from 'rxjs/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppState } from './store/store-setup';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Exchange, Exchanged } from './store/actions/app.actions';
import * as FromAppActions from './store/actions/app.actions';

const initialState: AppState = {
  exchange: {
    sourceCurrency: 'GBP',
    destinationCurrency: 'USD',
    amountToConvert: 0,
    convertedAmount: 0
  }
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;
  let testScheduler: TestScheduler;
  let store: MockStore<AppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [provideMockStore({ initialState })]
    });

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected)));

  it('should have access to exchange data', () => {
    testScheduler.run(({expectObservable, hot}: RunHelpers) => {
      //arrange
      const expectedMarble = hot('a', {a: initialState.exchange });

      //act
      fixture.detectChanges();

      //assert
      expectObservable(appComponent.exchangedData$).toEqual(expectedMarble)
    });
  })

  it(`should dispatch action: ${FromAppActions.exchangeCurrency.type} when exchangeCurrency is executed`, () => {
          //arrange
          const exchangeCurrency: Exchange = {
            sourceCurrency: 'GBP',
            destinationCurrency: 'EUR',
            amountToConvert: 10000
          };
          spyOn(store, 'dispatch').and.callFake(() => null);

          //act
          fixture.detectChanges();
          appComponent.exchangeCurrency(exchangeCurrency);

          //assert
          expect(store.dispatch).toHaveBeenCalledWith(FromAppActions.exchangeCurrency(exchangeCurrency));
  })
});
