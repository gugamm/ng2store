/**
 * Created by Gustavo on 02/10/2016.
 */

import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { StoreDependency, ActionDependency } from '../store-models/index';

import 'rxjs/add/observable/zip';

@Injectable()
export class DependencyResolver {
  public constructor(private _injector : Injector) {}

  public resolveStoreDependencies(dependencies : StoreDependency[]) : Observable<any> {
    const observable = (observer : Observer<any>) => {
      let dependency: StoreDependency;
      let asyncSubscription : Subscription;
      let asyncDependencies : any[] = [];
      let hasError : boolean = false;

      for (let i = 0; i < dependencies.length; i++) {
        dependency = dependencies[i];
        let dependencyInstance : any = this._injector.get(dependency.dependency);
        const resolverReturn = dependency.resolve(dependencyInstance);

        if (typeof resolverReturn === "boolean") {
          if (!resolverReturn) {
            observer.error('Could not solve dependency');
            hasError = true;
            break;
          }
        } else if (resolverReturn instanceof Observable) {
          asyncDependencies.push(resolverReturn);
        } else {
          observer.error('Invalid return type from dependency');
          hasError = true;
          break;
        }
      }

      if (!hasError) {
        if (asyncDependencies.length > 0) {
          asyncSubscription = Observable.zip(...asyncDependencies).subscribe(
            () => {
              asyncSubscription.unsubscribe();
              observer.next(null);
              observer.complete();
            },
            (error: any) => {
              observer.error(error);
            },
            () => {
              observer.next(null);
              observer.complete();
            }
          );
        } else {
          observer.next(null);
          observer.complete();
        }
      }

      return () => {
        if (asyncSubscription)
          asyncSubscription.unsubscribe();
      };
    };

    return Observable.create(observable);
  }

  public resolveActionDependencies(dependencies : ActionDependency[]) : Observable<any> {
    const observable = (observer : Observer<any>) => {
      let dependency: ActionDependency;
      let asyncSubscription : Subscription;
      let asyncDependencies : any[] = [];
      let hasError : boolean = false;

      for (let i = 0; i < dependencies.length; i++) {
        dependency = dependencies[i];
        const resolverReturn = dependency.resolve();

        if (typeof resolverReturn === "boolean") {
          if (!resolverReturn) {
            observer.error('Could not solve dependency');
            hasError = true;
            break;
          }
        } else if (resolverReturn instanceof Observable) {
          asyncDependencies.push(resolverReturn);
        } else {
          observer.error('Invalid return type from dependency');
          hasError = true;
          break;
        }
      }

      if (!hasError) {
        if (asyncDependencies.length > 0) {
          asyncSubscription = Observable.zip(...asyncDependencies).subscribe(
            () => {
              asyncSubscription.unsubscribe();
              observer.next(null);
              observer.complete();
            },
            (error: any) => {
              observer.error(error);
            },
            () => {
              observer.next(null);
              observer.complete();
            }
          );
        } else {
          observer.next(null);
          observer.complete();
        }
      }

      return () => {
        if (asyncSubscription)
          asyncSubscription.unsubscribe();
      };
    };

    return Observable.create(observable);
  }
}
