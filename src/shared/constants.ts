export const TOPICS = {
  START_APPLICATION: "start-application",
  STOP_APPLICATION: "stop-application",
  LIVEVIEW_DATA: "liveview-data",
  INIT_STATUSMESSAGE: "init-statusmessage",
  INIT_COLLAGE: "init-collage",
  CREATE_COLLAGE: "create-collage",
  RESET_COLLAGE: "reset-collage",
  PHOTO: "photo",
  PRINT_SYNC: "print-sync",
  ALL_PHOTOS: "all_photos",
  GOTO_PHOTOLIST: "goto-photolist",
  ERROR_MESSAGE: "error-message",
  GET_CAMERA_DRIVERS_SYNC: "get-camera-drivers-sync",
  GET_TEMPLATES_SYNC: "get-templates-sync",
  CREATE_COLLAGE_PREVIEW_SYNC: "create-collage-preview-sync",

  RECEIVING: "receiving",
  TAKE_PICTURE: "take-picture",
  PREPARE_PICTURE: "prepare-picture",
  OPEN_DIALOG_SYNC: "open-dialog-sync",
};

export interface MainApplicationConfiguration {
  cameraDrivers: string[];
}
