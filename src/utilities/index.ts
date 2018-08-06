import * as _ from 'lodash';

export function checkRequiredKeys(object, requiredKeys) {
  if (!_.every(requiredKeys, _.partial(_.has, object))) {
    throw new TypeError(`'${JSON.stringify(object)}' does not contain all required keys: '${JSON.stringify(requiredKeys)}'`);
  }
}
