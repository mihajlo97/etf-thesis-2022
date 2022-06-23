export interface Result {}

export interface ImageClassificationResult extends Result {
  className: string;
  probability: number;
}

export interface ImageClassificationModel {
  id: number;
  label: string;
}
