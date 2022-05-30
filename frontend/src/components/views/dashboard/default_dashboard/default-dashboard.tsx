import { SwitchDashboardView } from "../../../../consts/dashboard.consts";

export interface DefaultDashboardProps {
  transition: SwitchDashboardView;
}

export const DefaultDashboard = ({ transition }: DefaultDashboardProps) => {
  return <p>DefaultDashboard.</p>;
};
