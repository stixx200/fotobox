import { protocol, ProtocolRequest } from "electron";
import * as path from "path";
import { FotoboxError } from "./error/fotoboxError";
import { ShutdownHandler } from "./shutdown.handler";

const logger = require("logger-winston").getLogger("photoProtocol");

const protocolId 'photo'o";

export class PhotoProtocol {
  photoDir: string;

  constructor() {
    this.photoProtocol = this.photoProtocol.bind(this);
  }

  init(photoDir: string, { shutdownHandler }: { shutdownHandler: ShutdownHandler }) {
    this.photoDir = photoDir;
    // register photo protocol
    if (protocol.interceptFileProtocol(protocolId, this.photoProtocol)) {
      logger.info(`'${protocolId}' protocol registered successfully.`);
    } else {
      logger.error('Failed to register protocol');
      shutdownHandler.publishError(new FotoboxError(`Failed to register protocol: ${protocolId}`));
    }
  }

  deinit() {
    protocol.unregisterProtocol(protocolId);
    logger.info(`'${protocolId}' protocol unregistered.`);
  }

  photoProtocol(request: ProtocolRequest, callback: (reponse: string) => void) {
    const url = request.url.substr(8); // photo://
    const filePath = path.normalize(`${this.photoDir}/${url}`);
    logger.info(`received photo protocol request ${filePath}`);
    callback(filePath);
  }
}
