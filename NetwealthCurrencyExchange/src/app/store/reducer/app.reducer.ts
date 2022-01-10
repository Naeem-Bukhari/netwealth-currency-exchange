import { Exchanged } from './../actions/app.actions';
import { Action, createReducer, on } from "@ngrx/store";
import { updateExchange } from "../actions/app.actions";

const INITIAL_STATE: Exchanged = {
  sourceCurrency: 'GBP',
  destinationCurrency: 'USD',
  amountToConvert: 0,
  convertedAmount: 0
}

const _reducer = createReducer(INITIAL_STATE,
  on(updateExchange, (state, {type, ...exchanged}) => ({
    ...state,
    ...exchanged
  }))
);

export function exchangeReducer(state = INITIAL_STATE, action: Action) {
  return _reducer(state, action);
}
