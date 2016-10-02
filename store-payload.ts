import { StoreState } from './store-state';

export interface StorePayload<T> {
  storeState : StoreState;
  data       ?: T;
};
