import { Observable } from 'rxjs/Observable';

export interface ActionDependency {
  resolve() : boolean | Observable<any>;
}
