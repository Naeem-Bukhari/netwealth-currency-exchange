import { createSelector } from "@ngrx/store";
import { Exchanged } from "../actions/app.actions";
import { AppState } from "../store-setup";

export const exchangeDataSelector = createSelector(
  (appState: AppState) => appState.exchange,
  (exchangedData: Exchanged) => exchangedData
);
