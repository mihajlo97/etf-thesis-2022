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

export interface ProcessingTime {
  imagePreparationTime: number;
  predictionTime: number;
  totalProcessingTime: number;
  responseTime?: number;
}

export interface ImageClassificationResults {
  resolution: Resolution;
  results: PredictionResult[];
  processingTime: ProcessingTime;
}
