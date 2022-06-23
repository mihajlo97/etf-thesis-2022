/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  DashboardView,
  SwitchDashboardView,
} from "../../../../model/dashboard.model";
import {
  clearResizedImage,
  getAspectRatio,
  getAspectRatios,
  getImageScale,
  getImageScales,
  getUploadedImageURL,
} from "../../../../service/image.service";
import { getModel, getModels } from "../../../../service/tensorflow.service";

export interface SettingsProps {
  transition: SwitchDashboardView;
}

export const Settings = ({ transition }: SettingsProps) => {
  const [imageScale, setImageScale] = React.useState(getImageScale(0));
  const [aspectRatio, setAspectRatio] = React.useState(getAspectRatio(0));
  const [model, setModel] = React.useState(getModel(0));

  const selectImageScaleId = "settings_select_image_scale";
  const selectAspectRatioId = "settings_select_aspect_ratio";
  const selectModelId = "settings_select_model";

  const onChangeImageScale = (ev: any) => {
    const scale = getImageScale(ev.target.value as number);

    setImageScale(scale);
  };

  const onChangeAspectRatio = (ev: any) => {
    const ratio = getAspectRatio(ev.target.value as number);

    setAspectRatio(ratio);
  };

  const onChangeModel = (ev: any) =>
    setModel(getModel(ev.target.value as number));

  const renderChooseImageScale = () => (
    <select
      id={selectImageScaleId}
      className="uk-select uk-margin-small-top"
      onChange={onChangeImageScale}
    >
      {getImageScales().map((scale, idx) => (
        <option key={idx} defaultChecked={idx === 0} value={idx}>
          {scale.label}
        </option>
      ))}
    </select>
  );

  const renderChooseAspectRatio = () => (
    <select
      id={selectAspectRatioId}
      className="uk-select uk-margin-small-top"
      onChange={onChangeAspectRatio}
    >
      {getAspectRatios().map((ratio, idx) => (
        <option key={idx} defaultChecked={idx === 0} value={idx}>
          {ratio.label}
        </option>
      ))}
    </select>
  );

  const renderChooseModel = () => (
    <select
      id={selectModelId}
      className="uk-select uk-margin-small-top"
      onChange={onChangeModel}
    >
      {getModels().map((model, idx) => (
        <option key={idx} defaultChecked={idx === 0} value={idx}>
          {model.label}
        </option>
      ))}
    </select>
  );

  const returnToDashboard = () => transition(DashboardView.INITIAL);

  const submitReport = () =>
    transition(DashboardView.REPORT, { imageScale, aspectRatio, model });

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
          <label htmlFor={selectImageScaleId}>{"Image scale: "}</label>
          {renderChooseImageScale()}
          <small>
            {
              "The selected multiplier will be applied to the image's width and height."
            }
          </small>
        </div>

        <div className="uk-margin-top">
          <label htmlFor={selectAspectRatioId}>{"Aspect ratio: "}</label>
          {renderChooseAspectRatio()}
          <small>{"Image will be resized to the selected aspect ratio."}</small>
        </div>

        <div className="uk-margin-top">
          <label htmlFor={selectModelId}>{"Model: "}</label>
          {renderChooseModel()}
          <small>
            {
              "The selected machine learning model will be applied during image processing."
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
