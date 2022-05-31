/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { SwitchDashboardView } from "../../../../consts/dashboard.consts";
import { getUploadedImageURL } from "../../../../service/dashboard.service";

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
