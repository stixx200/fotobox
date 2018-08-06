import * as path from 'path';
import {protocol, RegisterFileProtocolRequest} from 'electron';
import {ShutdownHandler} from './shutdown.handler';

const protocol_id = 'photo';

export class PhotoProtocol {
  photoDir: string;

  constructor() {
    this.photoProtocol = this.photoProtocol.bind(this);
  }

  init(photoDir: string, { shutdownHandler }: { shutdownHandler: ShutdownHandler}) {
    this.photoDir = photoDir;
    // register photo protocol
    protocol.registerFileProtocol(
      protocol_id,
      this.photoProtocol,
      (error) => {
        if (error) {
          console.error('Failed to register protocol');
          shutdownHandler.publishError(error);
        }
        console.log('photo protocol registered successfully.');
      });
  }

  deinit() {
    protocol.unregisterProtocol(protocol_id);
  }

  photoProtocol(request: RegisterFileProtocolRequest, callback: (filePath?: string) => void) {
    const url = request.url.substr(8); // photo://
    const filePath = path.normalize(`${this.photoDir}/${url}`);
    callback(filePath);
  }
}
