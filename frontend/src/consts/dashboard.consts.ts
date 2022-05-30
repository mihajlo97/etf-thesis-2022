export enum DashboardView {
  INITIAL = 1,
  SELECT_UPLOAD_TYPE,
  WEBCAM,
  SETTINGS,
  PROCESSING,
  RESULTS,
}

export type SwitchDashboardView = (view: DashboardView) => void;