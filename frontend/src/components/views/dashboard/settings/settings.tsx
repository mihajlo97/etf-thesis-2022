import { SwitchDashboardView } from "../../../../consts/dashboard.consts";

export interface SettingsProps {
  transition: SwitchDashboardView;
}

export const Settings = ({ transition }: SettingsProps) => {
  return <p>Settings.</p>;
};
