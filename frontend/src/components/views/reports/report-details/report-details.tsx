/* eslint-disable jsx-a11y/alt-text */
import { GetReportResponse } from '../../../../model/api-response.model';
import { Spinner } from '../../../UI/spinner/spinner';

export type ReportDetailsState = 'report' | 'loading' | 'error';

export interface ReportDetailsProps {
  display: ReportDetailsState;
  report: GetReportResponse;
}

export const ReportDetails = ({ display, report }: ReportDetailsProps) => {
  const {
    name,
    resolution,
    aspectRatio,
    model,
    timestamp,
    clientClass,
    clientConfidence,
    clientTimeImage,
    clientTimePrediction,
    clientTimeProcessing,
    serverClass,
    serverConfidence,
    serverTimeImage,
    serverTimePrediction,
    serverTimeProcessing,
    serverTimeResponse,
    image,
  } = report;

  const getTimestampLabel = (timestamp: string) => new Date(parseInt(timestamp)).toLocaleString();

  const getTimeLabel = (t: number) => `${t} ms`;

  const getConfidenceLabel = (confidence: number) => `${confidence.toFixed(2)}%`;

  const getConfidenceDifference = (clientConfidence: number, serverConfidence: number) => {
    const isMoreConfident = clientConfidence >= serverConfidence;
    const difference = isMoreConfident ? clientConfidence / serverConfidence : serverConfidence / clientConfidence;

    return (
      <p style={{ color: isMoreConfident ? 'green' : 'red' }}>{`x${difference.toFixed(2)} ${
        isMoreConfident ? 'more' : 'less'
      } confident`}</p>
    );
  };

  const getTimeDifference = (clientTime: number, serverTime: number) => {
    const isFaster = clientTime <= serverTime;
    const difference = isFaster ? serverTime / clientTime : clientTime / serverTime;

    return (
      <p style={{ color: isFaster ? 'green' : 'red' }}>{`x${difference.toFixed(2)} ${
        isFaster ? 'faster' : 'slower'
      }`}</p>
    );
  };

  switch (display) {
    case 'loading':
      return (
        <div className="uk-flex uk-flex-center uk-margin-medium-top">
          <Spinner />
        </div>
      );

    case 'error':
      return (
        <div className="uk-alert-danger" data-uk-alert>
          {'An error has occurred while retrieving the report details, please try again.'}
        </div>
      );

    case 'report':
      return (
        <>
          <div>
            <h4>{'Source image:'}</h4>
            <img src={`data:image/png;base64,${image}`} />
          </div>

          <hr />

          <div className="uk-margin-top">
            <div className="uk-overflow-auto">
              <h4>{'Report settings:'}</h4>
              <table className="uk-table uk-table-divider">
                <tbody>
                  <tr>
                    <td>{'Name'}</td>
                    <td>{name}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>{'Resolution'}</td>
                    <td>{resolution}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>{'Aspect ratio'}</td>
                    <td>{aspectRatio}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>{'Model'}</td>
                    <td>{model}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>{'Timestamp'}</td>
                    <td>{getTimestampLabel(timestamp)}</td>
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
                    <td data-uk-tooltip="Prediction class name with highest confidence.">{'Best prediction class'}</td>
                    <td>{clientClass}</td>
                    <td>{serverClass}</td>
                    <td>{'/'}</td>
                  </tr>
                  <tr>
                    <td>{'Confidence'}</td>
                    <td>{getConfidenceLabel(clientConfidence)}</td>
                    <td>{getConfidenceLabel(serverConfidence)}</td>
                    <td>{getConfidenceDifference(clientConfidence, serverConfidence)}</td>
                  </tr>
                  <tr>
                    <td data-uk-tooltip="Time required to prepare the image before using it as algorithm input (rescaling, grayscaling, converting to tensor etc.).">
                      {'Image preparation time'}
                    </td>
                    <td>{getTimeLabel(clientTimeImage)}</td>
                    <td>{getTimeLabel(serverTimeImage)}</td>
                    <td>{getTimeDifference(clientTimeImage, serverTimeImage)}</td>
                  </tr>
                  <tr>
                    <td data-uk-tooltip="Time required for the algorithm to process the input tensor and output a predicted class result.">
                      {'Prediction time'}
                    </td>
                    <td>{getTimeLabel(clientTimePrediction)}</td>
                    <td>{getTimeLabel(serverTimePrediction)}</td>
                    <td>{getTimeDifference(clientTimePrediction, serverTimePrediction)}</td>
                  </tr>
                  <tr>
                    <td data-uk-tooltip="Time required to go from an image input to a predicted class result output.">
                      {'Processing time'}
                    </td>
                    <td>{getTimeLabel(clientTimeProcessing)}</td>
                    <td>{getTimeLabel(serverTimeProcessing)}</td>
                    <td>{getTimeDifference(clientTimeProcessing, serverTimeProcessing)}</td>
                  </tr>
                  <tr>
                    <td data-uk-tooltip="Time required to complete the entire image prediction request.">
                      {'Response time'}
                    </td>
                    <td>{getTimeLabel(clientTimeProcessing)}</td>
                    <td>{getTimeLabel(serverTimeResponse)}</td>
                    <td>{getTimeDifference(clientTimeProcessing, serverTimeResponse)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <small>
              <span style={{ color: 'red' }}>Red</span> indicates poorer client results, while{' '}
              <span style={{ color: 'green' }}>green</span> indicates better client results.
            </small>
          </div>
        </>
      );

    default:
      return null;
  }
};
