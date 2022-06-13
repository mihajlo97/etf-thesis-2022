export interface VideoConstraints {
  width: number;
  height: number;
  facingMode: string;
}

export interface Resolution {
  label: string;
  width: number;
  height: number;
}

export enum DashboardView {
  INITIAL = 1,
  SELECT_UPLOAD_TYPE,
  WEBCAM,
  SETTINGS,
  REPORT,
}

export type SwitchDashboardView = (view: DashboardView) => void;
