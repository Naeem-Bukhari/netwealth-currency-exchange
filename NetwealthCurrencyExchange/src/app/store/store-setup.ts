import { Action, ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { localStorageSync } from "ngrx-store-localstorage";
import { Exchanged } from "./actions/app.actions";
import { exchangeReducer } from "./reducer/app.reducer";

export interface AppState {
  exchange: Exchanged;
}

export const actionReducerMap: ActionReducerMap<AppState> = {
  exchange: exchangeReducer
}

export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({
    keys: ['exchange'],
    rehydrate: true
  })(reducer);
}

export const metaReducers: Array<MetaReducer<AppState, Action>> = [localStorageSyncReducer];
