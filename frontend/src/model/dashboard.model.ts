import { AspectRatio, ImageScale } from './image.model';
import { ImageClassificationModel } from './tensorflow.model';

export interface VideoConstraints {
  width: number;
  height: number;
  facingMode: string;
}

export interface ReportArgs {
  imageScale: ImageScale;
  aspectRatio: AspectRatio;
  model: ImageClassificationModel;
}

export interface ReportData {
  name: string;
  resolution: string;
  aspectRatio: string;
  model: string;
  timestamp: string;
  clientClass: string;
  clientConfidence: string;
  clientTimeImage: string;
  clientTimePrediction: string;
  clientTimeProcessing: string;
  serverClass: string;
  serverConfidence: string;
  serverTimeImage: string;
  serverTimePrediction: string;
  serverTimeProcessing: string;
  serverTimeResponse: string;
}

export enum DashboardView {
  INITIAL = 1,
  SELECT_UPLOAD_TYPE,
  WEBCAM,
  SETTINGS,
  REPORT,
}

export type SwitchDashboardView = (view: DashboardView, args?: any) => void;
