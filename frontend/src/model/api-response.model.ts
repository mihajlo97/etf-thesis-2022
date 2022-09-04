import { ReportOverview } from './report.model';

export interface RegisterUserResponse {
  msg?: string;
}

export interface LoginUserResponse {
  msg?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface ClassifyImageResponse {
  msg?: string;
  results: any;
  imagePreparationTime: number;
  predictionTime: number;
  totalProcessingTime: number;
}

export interface StoreReportResponse {
  msg?: string;
}

export interface GetReportsResponse {
  reports: ReportOverview[];
  msg?: string;
}

export interface GetReportResponse {
  msg?: string;
  name: string;
  resolution: string;
  aspectRatio: string;
  model: string;
  timestamp: number;
  clientClass: string;
  clientConfidence: number;
  clientTimeImage: number;
  clientTimePrediction: number;
  clientTimeProcessing: number;
  serverClass: string;
  serverConfidence: number;
  serverTimeImage: number;
  serverTimePrediction: number;
  serverTimeProcessing: number;
  serverTimeResponse: number;
  image: string;
}

export interface DeleteReportResponse {
  msg?: string;
}
