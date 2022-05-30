/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
  DashboardView,
  SwitchDashboardView,
} from "../../../../consts/dashboard.consts";
import { Waiting } from "../waiting/waiting";

export interface SelectUploadTypeProps {
  transition: SwitchDashboardView;
}

export const SelectUploadType = ({ transition }: SelectUploadTypeProps) => {
  const returnToDefaultDashboard = () => {
    transition(DashboardView.INITIAL);
  };

  const handleImageUpload = (ev: any) => {
    sessionStorage.setItem(
      "IMAGE_URL",
      URL.createObjectURL(ev.target.files[0])
    );
  };

  const openWebcam = () => {
    transition(DashboardView.WEBCAM);
  };

  return (
    <div>
      <div className="js-upload uk-padding-small" data-uk-form-custom>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button className="uk-button uk-button-primary uk-width-1-1">
          {"Upload image"}
        </button>
      </div>

      <div className="uk-padding-small">
        <button
          className="uk-button uk-button-secondary uk-width-1-1"
          onClick={openWebcam}
        >
          {"Open webcam"}
        </button>
      </div>

      <div className="uk-padding-small" style={{ textAlign: "center" }}>
        <a onClick={returnToDefaultDashboard}>{"Return to dashboard"}</a>
      </div>
    </div>
  );
};
