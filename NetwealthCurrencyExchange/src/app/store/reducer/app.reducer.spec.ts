import { Exchanged } from './../actions/app.actions';
import * as FromAppActions from '../actions/app.actions';
import { exchangeReducer } from './app.reducer';

describe('App Reducer', () => {
  it(`should update state to store new exchanged currency data when action: ${FromAppActions.updateExchange.type} is dispatched`, () => {
    //arrange
    const initialState: Exchanged = {
      sourceCurrency: 'GBP',
      destinationCurrency: 'USD',
      amountToConvert: 0,
      convertedAmount: 0
    };

    const exchanged: Exchanged = {
      sourceCurrency: 'GBP',
      destinationCurrency: 'EUR',
      amountToConvert: 1000,
      convertedAmount: 1223
    }

    //act
    const result = exchangeReducer(initialState, FromAppActions.updateExchange(exchanged));

    //assert
    expect(result).toEqual(exchanged);
    expect(result).not.toBe(exchanged); //immutability check
  })
})
