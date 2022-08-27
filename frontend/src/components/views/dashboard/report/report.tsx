/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

import { DashboardView, ReportArgs, SwitchDashboardView } from '../../../../model/dashboard.model';
import { Resolution } from '../../../../model/image.model';
import { PredictionResult, ProcessingTime } from '../../../../model/tensorflow.model';
import { storeReport } from '../../../../service/api.service';
import { getSourceImageURL, transformImage } from '../../../../service/image.service';
import { classifyImageLocally, sendImageForClassification } from '../../../../service/tensorflow.service';

import { Spinner } from '../../../UI/spinner/spinner';

export interface ResultsProps {
  transition: SwitchDashboardView;
  args: ReportArgs;
}

export type ReportState = 'processing' | 'error' | 'results';

export type SavingState = 'standby' | 'saving' | 'saved' | 'retry';

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
  const [reportName, setReportName] = React.useState('');
  const [saveButtonState, setSaveButtonState] = React.useState('standby' as SavingState);
  const [emptyNameError, setEmptyNameError] = React.useState(false);

  const { imageScale, aspectRatio, model } = args;

  const shouldProcessImage = () => state === 'processing';

  const shouldStoreReport = () => saveButtonState === 'saving';

  const getCardHeader = () => (
    <div>
      <h4 style={{ textAlign: 'center' }}>{'Report'}</h4>
      <hr />
    </div>
  );

  const getResolutionLabel = (resolution: Resolution) => `${resolution.width}x${resolution.height}`;

  const getBestPredictionClass = (results: PredictionResult[]) => results[0].className.replaceAll('_', ' ');

  const getBestConfidence = (results: PredictionResult[]) => `${(results[0].probability * 100).toFixed(2)}%`;

  const getTimeLabel = (t: number | undefined) => `${t} ms`;

  const getConfidenceDifference = () => {
    const localConfidence = localResults[0].probability;
    const serverConfidence = serverResults[0].probability;

    const isMoreConfident = localConfidence >= serverConfidence;
    const difference = isMoreConfident ? localConfidence / serverConfidence : serverConfidence / localConfidence;

    return (
      <p style={{ color: isMoreConfident ? 'green' : 'red' }}>{`x${difference.toFixed(2)} ${
        isMoreConfident ? 'more' : 'less'
      } confident`}</p>
    );
  };

  const getTimeDifference = (localTime: number | undefined, serverTime: number | undefined) => {
    const local = localTime ?? 1;
    const server = serverTime ?? 1;

    const isFaster = local <= server;
    const difference = isFaster ? server / local : local / server;

    return (
      <p style={{ color: isFaster ? 'green' : 'red' }}>{`x${difference.toFixed(2)} ${
        isFaster ? 'faster' : 'slower'
      }`}</p>
    );
  };

  const onReportNameChange = (ev: any) => {
    const value = ev.target.value;
    setReportName(value);
    setEmptyNameError(value === '');
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

      setLocalProcessingTime(resultsLocal.processingTime);
      setServerProcessingTime(resultsServer.processingTime);

      const { width, height } = resultsLocal.resolution;

      setResolution({ width, height });
      setState('results');
    } catch (err) {
      console.error('GenerateReportError', { err });
      setState('error');
    }
  };

  const saveReport = () => {
    if (reportName === '') {
      setEmptyNameError(true);
      return;
    }

    setSaveButtonState('saving');
  };

  const renderSaveButton = () => {
    switch (saveButtonState) {
      case 'saving':
        return (
          <div className="uk-flex uk-flex-center ">
            <Spinner />
          </div>
        );

      case 'saved':
        return (
          <button className="uk-button uk-button-primary uk-width-1-1 " disabled>
            {'Saved'}
          </button>
        );

      case 'retry':
        return (
          <button className="uk-button uk-button-danger uk-width-1-1 " onClick={saveReport}>
            {'Retry saving'}
          </button>
        );

      default:
        return (
          <button className="uk-button uk-button-primary uk-width-1-1 " onClick={saveReport}>
            {'Save report'}
          </button>
        );
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

  React.useEffect(() => {
    if (shouldStoreReport()) {
      storeReport({})
        .then((res) => {
          setSaveButtonState('saved');
        })
        .catch((err) => {
          setSaveButtonState('retry');
        });
    }
  }, [saveButtonState]);

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
              <h4>{'Source image:'}</h4>
              <img src={getSourceImageURL()} className="uk-margin-small-top" />
            </div>

            <hr />

            <div className="uk-margin-top">
              <div className="uk-overflow-auto">
                <h4>{'Report details:'}</h4>
                <table className="uk-table uk-table-divider">
                  <tbody>
                    <tr>
                      <td>{'Resolution'}</td>
                      <td>{getResolutionLabel(resolution)}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{'Aspect ratio'}</td>
                      <td>{aspectRatio.label}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{'Model'}</td>
                      <td>{model.label}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{'Timestamp'}</td>
                      <td>{timestamp}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <hr />

            <div className="uk-margin-top">
              <div className="uk-overflow-auto">
                <h4>{'Results:'}</h4>
                <table className="uk-table uk-table-divider">
                  <thead>
                    <tr>
                      <th>{'Item'}</th>
                      <th>{'Client'}</th>
                      <th>{'Server'}</th>
                      <th>{'Difference'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-uk-tooltip="Prediction class name with highest confidence.">
                        {'Best prediction class'}
                      </td>
                      <td>{getBestPredictionClass(localResults)}</td>
                      <td>{getBestPredictionClass(serverResults)}</td>
                      <td>{'/'}</td>
                    </tr>
                    <tr>
                      <td>{'Confidence'}</td>
                      <td>{getBestConfidence(localResults)}</td>
                      <td>{getBestConfidence(serverResults)}</td>
                      <td>{getConfidenceDifference()}</td>
                    </tr>
                    <tr>
                      <td data-uk-tooltip="Time required to prepare the image before using it as algorithm input (rescaling, grayscaling, converting to tensor etc.).">
                        {'Image preparation time'}
                      </td>
                      <td>{getTimeLabel(localProcessingTime.imagePreparationTime)}</td>
                      <td>{getTimeLabel(serverProcessingTime.imagePreparationTime)}</td>
                      <td>
                        {getTimeDifference(
                          localProcessingTime.imagePreparationTime,
                          serverProcessingTime.imagePreparationTime
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td data-uk-tooltip="Time required for the algorithm to process the input tensor and output a predicted class result.">
                        {'Prediction time'}
                      </td>
                      <td>{getTimeLabel(localProcessingTime.predictionTime)}</td>
                      <td>{getTimeLabel(serverProcessingTime.predictionTime)}</td>
                      <td>
                        {getTimeDifference(localProcessingTime.predictionTime, serverProcessingTime.predictionTime)}
                      </td>
                    </tr>
                    <tr>
                      <td data-uk-tooltip="Time required to go from an image input to a predicted class result output.">
                        {'Processing time'}
                      </td>
                      <td>{getTimeLabel(localProcessingTime.totalProcessingTime)}</td>
                      <td>{getTimeLabel(serverProcessingTime.totalProcessingTime)}</td>
                      <td>
                        {getTimeDifference(
                          localProcessingTime.totalProcessingTime,
                          serverProcessingTime.totalProcessingTime
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td data-uk-tooltip="Time required to complete the entire image prediction request.">
                        {'Response time'}
                      </td>
                      <td>{getTimeLabel(localProcessingTime.responseTime)}</td>
                      <td>{getTimeLabel(serverProcessingTime.responseTime)}</td>
                      <td>{getTimeDifference(localProcessingTime.responseTime, serverProcessingTime.responseTime)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <small>
                <span style={{ color: 'red' }}>Red</span> indicates poorer client results, while{' '}
                <span style={{ color: 'green' }}>green</span> indicates better client results.
              </small>
            </div>

            <hr />

            <div className="uk-margin-large-bottom">
              <h4>Save report</h4>
              <label>Report name:</label>
              <input
                className={`uk-input uk-margin-small-top ${emptyNameError ? 'uk-form-danger' : ''}`}
                type="text"
                placeholder="Enter report name"
                onChange={onReportNameChange}
                disabled={saveButtonState === 'saved'}
              ></input>
              {emptyNameError ? <small className="uk-text-danger">Please enter report name first.</small> : null}
            </div>

            {renderSaveButton()}

            <button className="uk-button uk-button-secondary uk-width-1-1 uk-margin-top" onClick={returnToSettings}>
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
