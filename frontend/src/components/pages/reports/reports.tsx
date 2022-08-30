/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import { GetReportsResponse } from '../../../model/api-response.model';
import { ReportOverview } from '../../../model/report.model';
import { getReports } from '../../../service/api.service';
import { Spinner } from '../../UI/spinner/spinner';

export type ReportTableState = 'fetching' | 'success' | 'error';

export const Reports = () => {
  const [tableState, setTableState] = React.useState('fetching' as ReportTableState);
  const [reports, setReports] = React.useState([] as ReportOverview[]);
  const [selectedReport, setSelectedReport] = React.useState(0);

  const deleteReportBtnId = 'delete-report-btn';

  const shouldFetchReports = () => tableState === 'fetching';

  const shouldAttachListener = () => tableState === 'success';

  const getTimestampLabel = (timestamp: string) => `${new Date(parseInt(timestamp)).toLocaleString()}`;

  const getResultLabel = (className: string, confidence: number) => `${className} (${confidence.toFixed(2)})%`;

  const getSelectedReportName = () => reports[selectedReport].name;

  const handleViewDetails = (idx: number) => {};

  const handleDelete = (idx: number) => {
    setSelectedReport(idx);
  };

  const deleteReport = () => {
    console.log('DELETE');
    setReports([...reports.splice(selectedReport, 1)]);
  };

  const deleteReportHandler = (event: any) => {
    deleteReport();
  };

  React.useEffect(() => {
    if (shouldFetchReports()) {
      getReports()
        .then((res) => {
          const data = res.data as GetReportsResponse;

          setReports([...data.reports]);
          setTableState('success');
        })
        .catch((err) => {
          setTableState('error');
          console.error('GetReportsError', { err });
        });
    }
  }, []);

  React.useEffect(() => {
    if (!shouldAttachListener()) {
      return;
    }

    const deleteBtn = document.getElementById(deleteReportBtnId);

    deleteBtn?.addEventListener('click', deleteReportHandler);

    return () => deleteBtn?.removeEventListener('click', deleteReportHandler);
  }, [tableState]);

  switch (tableState) {
    case 'success':
      return (
        <>
          <div className="uk-overflow-auto">
            <table className="uk-table uk-table-divider uk-table-middle">
              <thead>
                <tr>
                  <th>{'Timestamp'}</th>
                  <th>{'Report'}</th>
                  <th>{'Client results'}</th>
                  <th>{'Server results'}</th>
                  <th>{'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, idx) => (
                  <tr key={idx}>
                    <td>{getTimestampLabel(report.timestamp)}</td>
                    <td>{report.name}</td>
                    <td>{getResultLabel(report.clientClass, report.clientConfidence)}</td>
                    <td>{getResultLabel(report.serverClass, report.serverConfidence)}</td>
                    <td>
                      <button
                        className="uk-button uk-button-primary uk-width-1-1 uk-button-small"
                        onClick={() => handleViewDetails(idx)}
                      >
                        {'View details'}
                      </button>

                      <button
                        className="uk-button uk-button-danger uk-width-1-1 uk-button-small uk-margin-small-top"
                        type="button"
                        data-uk-toggle="target: #delete-modal"
                        onClick={() => handleDelete(idx)}
                      >
                        {'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div id="delete-modal" data-uk-modal>
            <div className="uk-modal-dialog uk-modal-body">
              <button className="uk-modal-close-default" type="button" data-uk-close></button>
              <h2 className="uk-modal-title uk-text-center">Delete report</h2>
              <p className="uk-text-center">{`Are you sure you want to delete report "${getSelectedReportName()}"?`}</p>
              <p className="uk-text-center">
                <button
                  className="uk-button uk-button-danger uk-width-1-1 uk-modal-close"
                  type="button"
                  id={deleteReportBtnId}
                >
                  {'Delete'}
                </button>
                <button
                  className="uk-button uk-button-default uk-width-1-1 uk-margin-small-top uk-modal-close"
                  type="button"
                >
                  {'Cancel'}
                </button>
              </p>
            </div>
          </div>
        </>
      );

    case 'error':
      return (
        <div className="uk-alert-danger uk-alert" data-uk-alert>
          <a className="uk-alert-close" data-uk-close />
          <p>{`An error has occurred while retrieving the user's reports, please try again.`}</p>
        </div>
      );

    case 'fetching':
      return (
        <div className="uk-flex uk-flex-center uk-margin-top">
          <Spinner />
        </div>
      );

    default:
      return null;
  }
};
