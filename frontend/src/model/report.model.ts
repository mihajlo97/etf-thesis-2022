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

export interface ReportOverview {
  reportId: string;
  name: string;
  timestamp: string;
  clientClass: string;
  clientConfidence: number;
  serverClass: string;
  serverConfidence: number;
}
