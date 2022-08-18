/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

import { DashboardView, ReportArgs, SwitchDashboardView } from '../../../../model/dashboard.model';
import { Resolution } from '../../../../model/image.model';
import { PredictionResult, ProcessingTime } from '../../../../model/tensorflow.model';
import { getSourceImageURL, transformImage } from '../../../../service/image.service';
import { classifyImageLocally, sendImageForClassification } from '../../../../service/tensorflow.service';

import { Spinner } from '../../../UI/spinner/spinner';

export interface ResultsProps {
  transition: SwitchDashboardView;
  args: ReportArgs;
}

export type ReportState = 'processing' | 'error' | 'results';

export const Report = ({ transition, args }: ResultsProps) => {
  const [state, setState] = React.useState('processing' as ReportState);
  const [localResults, setLocalResults] = React.useState([] as PredictionResult[]);
  const [serverResults, setServerResults] = React.useState([] as PredictionResult[]);
  const [resolution, setResolution] = React.useState({
    width: 0,
    height: 0,
  } as Resolution);
  const [timestamp, setTimestamp] = React.useState('');
  const [localProcessingTime, setLocalProcessingTime] = React.useState({} as ProcessingTime);
  const [serverProcessingTime, setServerProcessingTime] = React.useState({} as ProcessingTime);

  const { imageScale, aspectRatio, model } = args;

  const shouldDisplayResults = () => state === 'results';

  const shouldProcessImage = () => state === 'processing';

  const getLabelStyle = () => ({ fontWeight: 'bold' });

  const getCardHeader = () => (
    <>
      <h4 style={{ textAlign: 'center' }}>{'Report'}</h4>
      <hr />
    </>
  );

  const getResults = (results: PredictionResult[]) => {
    if (!shouldDisplayResults()) {
      return null;
    }

    return results.map((result, idx) => (
      <li key={idx} className="uk-margin-small-bottom">
        <span>{`Class name: ${result.className}`}</span>
        <br />
        <span>{`Probability: ${(result.probability * 100).toFixed(4)}%`}</span>
      </li>
    ));
  };

  const getProcessingTime = (processingTime: ProcessingTime) => {
    if (!shouldDisplayResults()) {
      return null;
    }

    const { imagePreparationTime, predictionTime, totalProcessingTime } = processingTime;

    return (
      <>
        <li>
          <span>{`Image preparation time: ${imagePreparationTime} ms`}</span>
        </li>
        <li>
          <span>{`Prediction time: ${predictionTime} ms`}</span>
        </li>
        <li>
          <span>{`Total processing time: ${totalProcessingTime} ms`}</span>
        </li>
      </>
    );
  };

  const setProcessingTime = (processingTime: ProcessingTime, local: boolean) => {
    const { imagePreparationTime, predictionTime, totalProcessingTime, modelLoadingTime, responseTime } =
      processingTime;

    local
      ? setLocalProcessingTime({
          imagePreparationTime,
          predictionTime,
          totalProcessingTime,
          modelLoadingTime,
        })
      : setServerProcessingTime({
          imagePreparationTime,
          predictionTime,
          totalProcessingTime,
          responseTime,
        });
  };

  const returnToSettings = () => transition(DashboardView.SETTINGS);

  const returnToDashboard = () => transition(DashboardView.INITIAL);

  const retryGeneratingReport = () => setState('processing');

  const generateReport = async () => {
    try {
      const resultsLocal = await classifyImageLocally(model.name);

      const startMeasuring = Date.now();

      const resultsServer = await sendImageForClassification(model.name);

      resultsServer.processingTime.responseTime = Date.now() - startMeasuring;

      setLocalResults([...resultsLocal.results]);
      setServerResults([...resultsServer.results]);

      setProcessingTime(resultsLocal.processingTime, true);
      setProcessingTime(resultsServer.processingTime, false);

      const { width, height } = resultsLocal.resolution;

      setResolution({ width, height });
      setState('results');
    } catch (err) {
      console.error('GenerateReportError', { err });
      setState('error');
    }
  };

  React.useEffect(() => {
    if (shouldProcessImage()) {
      transformImage(imageScale, aspectRatio)
        .then(() => generateReport())
        .catch((err) => console.error('TransformImageError', { err }))
        .finally(() => setTimestamp(new Date().toLocaleString()));
    }
  }, [state]);

  switch (state) {
    case 'processing':
      return (
        <>
          <div>
            {getCardHeader()}

            <div className="uk-flex uk-flex-center uk-padding">
              <Spinner />
            </div>
          </div>
        </>
      );

    case 'error':
      return (
        <>
          {getCardHeader()}

          <div className="uk-alert-danger uk-alert" data-uk-alert>
            <a className="uk-alert-close" data-uk-close onClick={retryGeneratingReport} />
            <p style={{ textAlign: 'center' }}>
              {'An error has occurred while generating the report. Please try again.'}
            </p>
          </div>

          <button className="uk-button uk-button-primary uk-width-1-1 uk-margin-top" onClick={retryGeneratingReport}>
            {'Retry'}
          </button>

          <button className="uk-button uk-button-default uk-width-1-1 uk-margin-top" onClick={returnToDashboard}>
            {'Cancel'}
          </button>
        </>
      );

    case 'results':
      return (
        <>
          <div>
            {getCardHeader()}

            <div>
              <label style={getLabelStyle()}>{'Source image:'}</label>
              <br />
              <img src={getSourceImageURL()} className="uk-margin-small-top" />
            </div>

            <div className="uk-margin-medium-top">
              <label style={getLabelStyle()}>{'Image resolution:'}</label>
              <br />
              <span>{`${resolution.width}x${resolution.height}`}</span>
            </div>

            <div className="uk-margin-top">
              <label style={getLabelStyle()}>{'Aspect ratio:'}</label>
              <br />
              <span>{aspectRatio.label}</span>
            </div>

            <div className="uk-margin-top">
              <label style={getLabelStyle()}>{'Model applied:'}</label>
              <br />
              <span>{model.label}</span>
            </div>

            <div className="uk-margin-medium-top">
              <label style={getLabelStyle()}>{'Results (Frontend):'}</label>
              <br />
              <label>{'Image predictions:'}</label>
              <ol>{getResults(localResults)}</ol>
              <label>{'Processing time:'}</label>
              <ul>
                <li>{`Model loading time: ${localProcessingTime.modelLoadingTime} ms`}</li>
                {getProcessingTime(localProcessingTime)}
              </ul>
            </div>

            <div className="uk-margin-medium-top">
              <label style={getLabelStyle()}>{'Results (Backend):'}</label>
              <br />
              <label>{'Image predictions:'}</label>
              <ol>{getResults(serverResults)}</ol>
              <label>{'Processing time:'}</label>
              <br />
              <ul>{getProcessingTime(serverProcessingTime)}</ul>
              <label>{`Response time: ${serverProcessingTime.responseTime} ms`}</label>
            </div>

            <div className="uk-margin-top">
              <label style={getLabelStyle()}>{'Timestamp:'}</label>
              <br />
              <span>{timestamp}</span>
            </div>

            <button
              className="uk-button uk-button-primary uk-width-1-1 uk-margin-medium-top"
              onClick={returnToSettings}
            >
              {'Change settings'}
            </button>

            <button className="uk-button uk-button-default uk-width-1-1 uk-margin-top" onClick={returnToDashboard}>
              {'Close report'}
            </button>
          </div>
        </>
      );
  }
};
