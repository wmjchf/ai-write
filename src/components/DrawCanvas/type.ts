export interface IConfig {
  width: number;
  height: number;
  canvasId: string;
  backgroundColor?: string;
  debug?: boolean;
  pixelRatio?: number;
  preload?: boolean;
  hideLoading?: boolean;
  blocks?: IBlock[];
  texts?: IText[];
  images?: IIMage[];
  qrcodes?: IQRCode[];
  lines?: ILine[];
  factor: number;
}

export interface IQRCode {
  type: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  padding?: number;
  // paddingColor: '#ffffff', // 默认与background一致
  typeNumber?: -1;
  correctLevel?: number;
  background?: string;
  foreground?: string;
  paddingColor?: string;
  image?: {
    imageResource: string;
    width: number;
    height: number;
    round: boolean;
  };
  zIndex?: number;
}

export interface IBlock {
  x: number;
  y: number;
  width?: number;
  height: number;
  paddingLeft?: number;
  paddingRight?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  text?: IText;
  opacity?: number;
  zIndex?: number;
  type: string;
}

export interface IText {
  x: number;
  y: number;
  type: string;
  text:
    | string
    | {
        text: string;
        marginLeft: number;
        marginRight: number;
      };
  fontSize: number;
  color?: string;
  opacity?: 1 | 0;
  lineHeight?: number;
  lineNum?: number;
  width?: number;
  marginLeft?: number;
  marginRight?: number;
  textDecoration?: "line-through" | "none";
  baseLine?: "top" | "middle" | "bottom";
  textAlign?: "left" | "center" | "right";
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  zIndex?: number;
  typesetting?: number;
}

export interface IIMage {
  x: number;
  y: number;
  url: string;
  width: number;
  height: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  zIndex?: number;
  type: string;
  opacity?: number;
  blur?: boolean;
}

export interface ILine {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  color?: string;
  zIndex?: number;
  type: string;
}

export type IDrawType = "text" | "image" | "block" | "line";

export type IDrawArrayItem = {
  type?: IDrawType;
} & (ILine | IIMage | IBlock | IText);
