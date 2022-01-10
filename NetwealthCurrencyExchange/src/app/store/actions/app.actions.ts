import { createAction, props } from "@ngrx/store";

export type Exchange = {
  sourceCurrency: string;
  destinationCurrency: string;
  amountToConvert: number;
}

export type Exchanged = Exchange & {
  convertedAmount: number
}

export const exchangeCurrency =       createAction('[App] Exchange Currency',          props<Exchange>());
export const updateExchange   =       createAction('[App] Update Exchanged Amount',    props<Exchanged>());
