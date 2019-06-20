import * as _ from 'lodash';
import * as request from 'superagent';

let _id = 0;

function id(): number {
  return ++_id;
}

export class CameraProxy {
  constructor(private services: { type: string, url: string }[]) {
  }

  async call(endpoint: string, method: string, params: any[] = [], version = '1.0') {
    const service = this.getService(endpoint);
    const { body } = await request
      .post(service.url)
      .send({
        method,
        params,
        id: id(),
        version,
      });
    if (body.error) {
      throw new Error(`Error occured while requesting '${service.url} - method: ${method} - params: ${JSON.stringify(params)}': ${body.error}`);
    }
    return body.result;
  }

  private getService(endpoint: string): { endpoint: string, url: string } {
    const service = _.find(this.services, ['type', endpoint]);
    if (!service) {
      throw new Error(`service '${service}' not found. Available are: '${this.services.join(', ')}'`);
    }
    return service;
  }
}
