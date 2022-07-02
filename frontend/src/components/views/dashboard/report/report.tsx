/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";

import {
  DashboardView,
  ReportArgs,
  SwitchDashboardView,
} from "../../../../model/dashboard.model";
import { Resolution } from "../../../../model/image.model";
import { PredictionResult } from "../../../../model/tensorflow.model";
import {
  getSourceImageURL,
  transformImage,
} from "../../../../service/image.service";
import {
  classifyImageLocally,
  sendImageForClassification,
} from "../../../../service/tensorflow.service";

import { Spinner } from "../../../UI/spinner/spinner";

export interface ResultsProps {
  transition: SwitchDashboardView;
  args: ReportArgs;
}

export type ReportState = "processing" | "error" | "results";

export const Report = ({ transition, args }: ResultsProps) => {
  const [state, setState] = React.useState("processing" as ReportState);
  const [results, setResults] = React.useState([] as PredictionResult[]);
  const [resolution, setResolution] = React.useState({
    width: 0,
    height: 0,
  } as Resolution);

  const { imageScale, aspectRatio, model } = args;

  const shouldDisplayResults = () => state === "results";

  const shouldProcessImage = () => state === "processing";

  const getLabelStyle = () => ({ fontWeight: "bold" });

  const getCardHeader = () => (
    <React.Fragment>
      <h4 style={{ textAlign: "center" }}>{"Report"}</h4>
      <hr />
    </React.Fragment>
  );

  const getResults = () => {
    if (!shouldDisplayResults()) {
      return null;
    }

    return (results as PredictionResult[]).map((result, idx) => (
      <div key={idx}>
        <span>{`${result.className} ${result.probability}`}</span>
        <br />
      </div>
    ));
  };

  const returnToSettings = () => transition(DashboardView.SETTINGS);

  const returnToDashboard = () => transition(DashboardView.INITIAL);

  const retryGeneratingReport = () => setState("processing");

  const generateReport = async () => {
    try {
      // const classificationResults = await classifyImageLocally();
      const classificationResults = await sendImageForClassification(
        model.name
      );
      const { width, height } = classificationResults.resolution;

      setResults([...classificationResults.results]);
      setResolution({ width, height });
      setState("results");
    } catch (err) {
      setState("error");
    }
  };

  React.useEffect(() => {
    if (shouldProcessImage()) {
      transformImage(imageScale, aspectRatio).then(() => generateReport());
    }
  }, [state]);

  switch (state) {
    case "processing":
      return (
        <React.Fragment>
          <div>
            {getCardHeader()}

            <div className="uk-flex uk-flex-center uk-padding">
              <Spinner />
            </div>
          </div>
        </React.Fragment>
      );

    case "error":
      return (
        <React.Fragment>
          {getCardHeader()}

          <div className="uk-alert-danger uk-alert" data-uk-alert>
            <a
              className="uk-alert-close"
              data-uk-close
              onClick={retryGeneratingReport}
            />
            <p style={{ textAlign: "center" }}>
              {
                "An error has occurred while generating the report. Please try again."
              }
            </p>
          </div>

          <button
            className="uk-button uk-button-primary uk-width-1-1 uk-margin-top"
            onClick={retryGeneratingReport}
          >
            {"Retry"}
          </button>

          <button
            className="uk-button uk-button-default uk-width-1-1 uk-margin-top"
            onClick={returnToDashboard}
          >
            {"Cancel"}
          </button>
        </React.Fragment>
      );

    case "results":
      return (
        <React.Fragment>
          <div>
            {getCardHeader()}

            <div>
              <label style={getLabelStyle()}>{"Source image:"}</label>
              <br />
              <img src={getSourceImageURL()} className="uk-margin-small-top" />
            </div>

            {
              <div className="uk-margin-medium-top">
                <label style={getLabelStyle()}>{"Image resolution:"}</label>
                <br />
                <span>{`${resolution.width}x${resolution.height}`}</span>
              </div>
            }

            <div className="uk-margin-top">
              <label style={getLabelStyle()}>{"Aspect ratio:"}</label>
              <br />
              <span>{aspectRatio.label}</span>
            </div>

            <div className="uk-margin-top">
              <label style={getLabelStyle()}>{"Model applied:"}</label>
              <br />
              <span>{model.label}</span>
            </div>

            <div className="uk-margin-top">
              <label style={getLabelStyle()}>{"Results:"}</label>
              <br />
              {getResults()}
            </div>

            <button
              className="uk-button uk-button-primary uk-width-1-1 uk-margin-medium-top"
              onClick={returnToSettings}
            >
              {"Change settings"}
            </button>

            <button
              className="uk-button uk-button-default uk-width-1-1 uk-margin-top"
              onClick={returnToDashboard}
            >
              {"Close report"}
            </button>
          </div>
        </React.Fragment>
      );
  }
};
