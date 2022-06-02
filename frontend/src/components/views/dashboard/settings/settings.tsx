/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  DashboardView,
  SwitchDashboardView,
} from "../../../../model/dashboard.model";
import { getUploadedImageURL } from "../../../../service/dashboard.service";

export interface SettingsProps {
  transition: SwitchDashboardView;
}

export const Settings = ({ transition }: SettingsProps) => {
  const resolutionId = "settings_select_resolution";
  const modelId = "settings_select_model";

  const returnToDashboard = () => transition(DashboardView.INITIAL);

  const submitReport = () => transition(DashboardView.REPORT);

  return (
    <React.Fragment>
      <div>
        <h4 style={{ textAlign: "center" }}>{"Report settings"}</h4>

        <div>
          <label>{"Image to process:"}</label>
          <img src={getUploadedImageURL()} className="uk-margin-small-top" />
        </div>

        <div className="uk-margin-medium-top">
          <label htmlFor={resolutionId}>{"Resolution: "}</label>
          <select id={resolutionId} className="uk-select uk-margin-small-top">
            <option defaultChecked>{"720p (1280x720)"}</option>
            <option>{"480p (640x480)"}</option>
            <option>{"720p (320x240)"}</option>
          </select>
        </div>

        <div className="uk-margin-top">
          <label htmlFor={modelId}>{"Model: "}</label>
          <select id={modelId} className="uk-select uk-margin-small-top">
            <option defaultChecked>{"Model A"}</option>
            <option>{"Model B"}</option>
            <option>{"Model C"}</option>
          </select>
        </div>

        <button
          className="uk-button uk-button-primary uk-width-1-1 uk-margin-medium-top"
          onClick={submitReport}
        >
          {"Generate report"}
        </button>

        <button
          className="uk-button uk-button-default uk-width-1-1 uk-margin-top"
          onClick={returnToDashboard}
        >
          {"Cancel"}
        </button>
      </div>
    </React.Fragment>
  );
};
