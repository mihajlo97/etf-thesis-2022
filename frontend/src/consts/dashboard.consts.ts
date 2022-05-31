import { VideoConstraints } from "../model/dashboard.model";

export enum DashboardView {
  INITIAL = 1,
  SELECT_UPLOAD_TYPE,
  WEBCAM,
  SETTINGS,
  PROCESSING,
  RESULTS,
}

export type SwitchDashboardView = (view: DashboardView) => void;

export const DEFAULT_WEBCAM_CONSTRAINTS = {
  width: 1280,
  height: 720,
  facingMode: "user",
} as VideoConstraints;
