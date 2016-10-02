import { StorePayload } from './store-payload';
import { StoreState }   from './store-state';
import { Observable }   from 'rxjs/Observable';

/***********************************************
 *
 * ASYNC STORE PATTERN
 *   Created by Gustavo Martins
 *
 * Description
 *   This pattern is a mix of Flux, Redux and Observable Services
 *   You can create Stores. Each one contains a StorePayload
 *   Stores must implement a Store interface.
 *   A store, only store one type of data. This data must be immutable.
 *   A store does not provide methods to modify its content. Their content are altered by Actions that can be sync or async
 *
 *   All store start with StoreState.uninitialized
 *
 ***********************************************/

export interface Store<T> {
  //The store must provide a getter method to access the payload synchronously
  payload : StorePayload<T>;
  //The store must provide a getter method to access the payload subject as an Observable. Use Subject.asObservable()
  payload$ : Observable<StorePayload<T>>;

  //The store must provide this method. Each time this method is called, the storeState must be set to updated
  setData(data : T) : void;
  //The store must provide this method, so Actions can set the store state(this is most important for async actions)
  setStoreState(storeState : StoreState) : void;
}
