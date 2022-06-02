export interface VideoConstraints {
  width: number;
  height: number;
  facingMode: string;
}

export enum DashboardView {
  INITIAL = 1,
  SELECT_UPLOAD_TYPE,
  WEBCAM,
  SETTINGS,
  REPORT,
}

export type SwitchDashboardView = (view: DashboardView) => void;
