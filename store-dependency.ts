import { Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export interface StoreDependency {
  dependency                         : Type<any>;
  resolve(dependencyInstance : any)  : boolean | Observable<any>;
};
