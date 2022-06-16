/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { MODELS, RESOLUTIONS } from "../../../../consts/dashboard.consts";
import {
  DashboardView,
  Resolution,
  SwitchDashboardView,
} from "../../../../model/dashboard.model";
import {
  clearResizedImage,
  getUploadedImageURL,
  resizeImage,
} from "../../../../service/image.service";

export interface SettingsProps {
  transition: SwitchDashboardView;
}

export const Settings = ({ transition }: SettingsProps) => {
  const [resolution, setResolution] = React.useState(RESOLUTIONS[0]);
  const [model, setModel] = React.useState(MODELS[0]);

  const resolutionId = "settings_select_resolution";
  const modelId = "settings_select_model";

  const onChangeResolution = (ev: any) => {
    const res = RESOLUTIONS[ev.target.value];
    resizeImage(res.width, res.height);

    setResolution(res);
  };

  const onChangeModel = (ev: any) => {
    setModel(MODELS[ev.target.value]);
  };

  const renderChooseResolution = () => (
    <select
      id={resolutionId}
      className="uk-select uk-margin-small-top"
      onChange={onChangeResolution}
    >
      {RESOLUTIONS.map((res, idx) => (
        <option key={idx} defaultChecked={idx === 0} value={idx}>
          {`${res.label} (${res.width}x${res.height})`}
        </option>
      ))}
    </select>
  );

  const renderChooseModel = () => (
    <select
      id={modelId}
      className="uk-select uk-margin-small-top"
      onChange={onChangeModel}
    >
      {MODELS.map((model, idx) => (
        <option key={idx} defaultChecked={idx === 0} value={idx}>
          {model}
        </option>
      ))}
    </select>
  );

  const returnToDashboard = () => transition(DashboardView.INITIAL);

  const submitReport = () =>
    transition(DashboardView.REPORT, { res: resolution, model: model });

  React.useEffect(() => {
    clearResizedImage();
  }, []);

  return (
    <React.Fragment>
      <div>
        <h4 style={{ textAlign: "center" }}>{"Report settings"}</h4>
        <hr />

        <div>
          <label>{"Image to process:"}</label>
          <br />
          <img src={getUploadedImageURL()} className="uk-margin-small-top" />
        </div>

        <div className="uk-margin-medium-top">
          <label htmlFor={resolutionId}>{"Resolution: "}</label>
          {renderChooseResolution()}
          <small>
            {
              "The picture will be resized to the chosen resolution for processing."
            }
          </small>
        </div>

        <div className="uk-margin-top">
          <label htmlFor={modelId}>{"Model: "}</label>
          {renderChooseModel()}
          <small>
            {
              "Choose the machine learning model to be applied during processing."
            }
          </small>
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
