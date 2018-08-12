export const TOPICS = {
  START_APPLICATION: 'start-application',
  STOP_APPLICATION: 'stop-application',
  START_LIVEVIEW: 'start-liveview',
  STOP_LIVEVIEW: 'stop-liveview',
  LIVEVIEW_DATA: 'liveview-data',
  GET_APP_CONFIG_SYNC: 'get-app-config-sync',
  INIT_STATUSMESSAGE: 'init-statusmessage',
  INIT_COLLAGE: 'init-collage',
  CREATE_COLLAGE: 'create-collage',
  RESET_COLLAGE: 'reset-collage',
  PHOTO: 'photo',
  PRINT_SYNC: 'print-sync',
  FILE_PICKER: 'file-picker',

  RECEIVING: 'receiving',
  ALL_PHOTOS: 'all_photos',
  TAKE_PICTURE: 'take-picture',
  PREPARE_PICTURE: 'prepare-picture',
};

export interface MainApplicationConfiguration {
  cameraDrivers: string[];
}
