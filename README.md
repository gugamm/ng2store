# ng2store
A design pattern influenced by Flux, Observable Services, Redux

### Types

ng2store is simple and has only 3 types that will help you to get start quick

* Store - An interface that expose the main methods a Store should implement
* StoreState<T> - A state of a store
* StorePayload<T> - The payload of a store

### Description

##### Store
A store is a interface that expose the main methods a Store should implement.
The methods are :

* payload : StorePayload<T> - returns a store payload synchronously
* payload$ : Observable<StorePayload<T>> - returns an Observable of the store payload
* setData(data : T) : void - a setter method to set the store data. This method must set the StoreState to updated
* setStoreState(storeState : StoreState) : void - a setter method to set the store state. This method is commonly used by Async Actions, but can be used by sync actions.

You should create an Angular Service implementing this interface. Each Store store a single type. A Store does not expose method to manipulate the data. Data can be manipulated by components directly(not recommended) or by an Action service.

##### StoreState
A StoreState is an enum that has these possible values:

* uninitialized - when the data has not been initialized yed
* updating - when the data is being updated
* interrupted - when a method has being interrupted while updating the data
* updated - when the data is up to date without errors
* error - when an error has occured while updating the data

##### StorePayload
A StorePayload is an interface exposing a StoreState and the data(anything)

### Manipulating Store Data With A Action Service
Stores does not provide methods to update their data. So how do we update them? What if we want to make an api call to update them? What if we want to initialize them after something has happen?

We do that using *Actions*

#### Action Service
Action Service is an angular 2 service that provide methods that will change a store data. These methods can be sync (in this case they will return void or boolean), or they can be async(in this case they will return an Observable or Promise indicating they are finished or emitting an error)

**Example**
```typescript
@Injectable()
export class TodoActions {
  public constructor(private _store : TodosStore) {}

  public addTodoSync(todo : Todo) : void {
    this._store.setData([...this._store.payload.data, todo]);
  }
  
  public addTodoAsync(todo : Todo) : Observable<any> {
    let observable = (observer : Observer<any>) => {
      this._store.setStoreState(StoreState.updating);
      
      //could be a http request here
      let timeoutId = setTimeout(
        () => {
          this._store.setData([...this._store.payload.data, todo]);
          observer.next(null);
          observer.complete();
        },2000);
        
        return () => {
          clearTimeout(timeoutId);
          this._store.setStoreState(StoreState.interrupted);
        };
    };
    
    return Observable.create(observable);
  }
}
```

#### Store Example
```typescript
@Injectable()
export class TodosStore implements Store<Todo[]> {
  private _payload$ : BehaviorSubject<StorePayload<Todo[]>>;
  
  public constructor() {
    this._payload$ = new BehaviorSubject<StorePayload<Todo[]>>({
        storeState : StoreState.uninitialized, 
        data : null
    });
  }
  
  get payload() : StorePayload<Todo[]> {
    return this._payload$.getValue();
  }
  
  get payload$() : Observable<StorePayload<Todo[]>> {
    return this._payload$.asObservable();
  }
  
  public setData(data : Todo[]) : void {
    this._payload$.next({data : data, storeState : StoreState.updated});
  }
  
  public setStoreState(storeState : StoreState) : void {
    this._payload$.next({data : this.payload.data, storeState : storeState});
  }
}
```

License
----

MIT

Talk to me
----

Please let me know what you think about this pattern!
