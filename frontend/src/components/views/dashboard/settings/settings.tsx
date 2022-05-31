/* eslint-disable jsx-a11y/alt-text */
import { SwitchDashboardView } from "../../../../model/dashboard.model";

export interface SettingsProps {
  transition: SwitchDashboardView;
}

export const Settings = ({ transition }: SettingsProps) => {
  return (
    <div>
      <p>Settings.</p>
    </div>
  );
};
