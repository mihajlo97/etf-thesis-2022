/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
  DashboardView,
  SwitchDashboardView,
} from "../../../../model/dashboard.model";
import { storeUploadedImage } from "../../../../service/dashboard.service";

export interface SelectUploadTypeProps {
  transition: SwitchDashboardView;
}

export const SelectUploadType = ({ transition }: SelectUploadTypeProps) => {
  const handleImageUpload = (ev: any) => {
    storeUploadedImage(false, ev.target.files[0]);
    transition(DashboardView.SETTINGS);
  };

  const openWebcam = () => {
    transition(DashboardView.WEBCAM);
  };

  return (
    <React.Fragment>
      <div>
        <h4 style={{ textAlign: "center" }}>{"Choose upload type"}</h4>
        <hr />

        <div
          className="js-upload uk-width-1-1 uk-margin-top"
          data-uk-form-custom
        >
          <button
            className="uk-button uk-button-primary uk-width-1-1"
            tabIndex={-1}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="uk-width-1-1"
            />
            {"Upload image"}
          </button>
        </div>

        <button
          className="uk-button uk-button-secondary uk-width-1-1 uk-margin-top"
          onClick={openWebcam}
        >
          {"Take picture"}
        </button>
      </div>
    </React.Fragment>
  );
};
