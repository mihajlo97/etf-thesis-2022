import { SwitchDashboardView } from "../../../../consts/dashboard.consts";

export interface WebcamProps {
  transition: SwitchDashboardView;
}

export const Webcam = ({ transition }: WebcamProps) => {
  return <p>Webcam.</p>;
};
