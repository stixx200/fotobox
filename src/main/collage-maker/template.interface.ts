export interface Border {
  colors: { r: number, g: number, b: number },
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export enum TEXT_ALIGN {
  CENTER,
  LEFT,
}

export interface SpaceStyle {
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  'border-radius'?: number;
  rotation?: number;
  textColor?: string;
  fontSize?: number;
  lineSpacing?: number;
  textAlign?: TEXT_ALIGN;
}

export interface CollageText {
  lines: string[];
}

export interface TemplateInterface {
  id: string;
  total_width: number;
  total_height: number;
  background?: string;
  border: Border;
  font?: string;
  spaces: {
    type: 'text' | 'photo' | 'brand';
    value?: string;
    description: string;
    width: number;
    height: number;
    x: number;
    y: number;
    style?: SpaceStyle;
  }[];
}
