import {EventEmitter} from 'eventemitter3';
import {TOPICS} from '../../../../main/constants';

export class DummyIpcRenderer extends EventEmitter {
  send(channel) {
    switch (channel) {
      case TOPICS.START_APPLICATION:
        this.emit(TOPICS.START_APPLICATION);
        break;
      case TOPICS.CREATE_COLLAGE:
        // this.emit(TOPICS.CREATE_COLLAGE, "./collage.jpg");
        break;
      default:
        break;
    }
  }

  sendSync(channel) {
    switch (channel) {
      case TOPICS.GET_APP_CONFIG_SYNC:
        return {cameraDrivers: []};
      default:
        return;
    }
  }
}
