export interface CameraInitConfiguration {
  photoDir: string;
  wifiControl: boolean;
  sonyPassword: string;
}

export type CameraProviderInitConfig = CameraInitConfiguration & {
  cameraDriver: string;
};

export interface PrinterConfiguration {
  photoDir: string;
  irfanViewPath: string;
}

export interface CollageMakerConfiguration {
  photoDir: string;
}

export type ApplicationInitConfiguration = CameraProviderInitConfig &
  PrinterConfiguration &
  CollageMakerConfiguration;
