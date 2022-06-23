import { Resolution } from "./image.model";

export interface PredictionResult {
  className: string;
  probability: number;
}

export interface ImageClassificationModel {
  id: number;
  label: string;
}

export interface ImageClassificationResults {
  resolution: Resolution;
  results: PredictionResult[];
}
