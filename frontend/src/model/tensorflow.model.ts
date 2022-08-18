import { ModelName } from './api-request.model';
import { Resolution } from './image.model';

export interface PredictionResult {
  className: string;
  probability: number;
}

export interface ImageClassificationModel {
  id: number;
  label: string;
  name: ModelName;
}

export interface ImageClassificationResults {
  resolution: Resolution;
  results: PredictionResult[];
  processingTime: number;
}
