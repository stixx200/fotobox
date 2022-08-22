import { Observable } from "rxjs";

export function getObservableValue<T>(observable: Observable<T>): T {
  let value = null;
  const subscription = observable.subscribe((data) => {
    value = data;
  });
  subscription.unsubscribe();
  return value;
}
