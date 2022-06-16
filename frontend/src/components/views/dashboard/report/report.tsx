/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";

import {
  DashboardView,
  ReportArgs,
  SwitchDashboardView,
} from "../../../../model/dashboard.model";
import {
  ImageClassificationResult,
  Result,
} from "../../../../model/tensorflow.model";
import { getSourceImageURL } from "../../../../service/image.service";
import { classifyImage } from "../../../../service/tensorflow.service";

import { Spinner } from "../../../UI/spinner/spinner";

export interface ResultsProps {
  transition: SwitchDashboardView;
  args: ReportArgs;
}

export type ReportState = "processing" | "error" | "results";

export const Report = ({ transition, args }: ResultsProps) => {
  const [state, setState] = React.useState("processing" as ReportState);
  const [results, setResults] = React.useState([] as Result[]);

  const { res, model } = args;

  const shouldDisplayResults = () => state === "results";

  const getLabelStyle = () => ({ fontWeight: "bold" });

  const getCardHeader = () => (
    <React.Fragment>
      <h4 style={{ textAlign: "center" }}>{"Report"}</h4>
      <hr />
    </React.Fragment>
  );

  const getImageClassificationResults = () =>
    (results as ImageClassificationResult[]).map((result, idx) => (
      <React.Fragment>
        <span key={idx}>{`${result.className} ${result.probability}`}</span>
        <br />
      </React.Fragment>
    ));

  const getResults = () => {
    if (!shouldDisplayResults()) {
      return null;
    }

    if (model.match(/image/i)) {
      return getImageClassificationResults();
    }
  };

  const returnToSettings = () => transition(DashboardView.SETTINGS);

  const returnToDashboard = () => transition(DashboardView.INITIAL);

  const retryGeneratingReport = () => setState("processing");

  const generateReport = async () => {
    try {
      const tfjsResults = await classifyImage();

      setResults([...tfjsResults]);
      setState("results");
    } catch (err) {
      setState("error");
    }
  };

  React.useEffect(() => {
    if (state === "processing") {
      generateReport();
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

            <div className="uk-margin-medium-top">
              <label style={getLabelStyle()}>{"Image resolution:"}</label>
              <br />
              <span>{`${res.width}x${res.height}`}</span>
            </div>

            <div className="uk-margin-top">
              <label style={getLabelStyle()}>{"Model applied:"}</label>
              <br />
              <span>{model}</span>
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
