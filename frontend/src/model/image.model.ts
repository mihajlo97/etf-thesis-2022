export interface ImageScale {
  id: number;
  multiplier: number;
  label: string;
}

export interface AspectRatio {
  id: number;
  aspectX: number;
  aspectY: number;
  label: string;
}

export interface Resolution {
  width: number;
  height: number;
}
