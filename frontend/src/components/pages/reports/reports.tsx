/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import { GetReportResponse, GetReportsResponse } from '../../../model/api-response.model';
import { ReportOverview } from '../../../model/report.model';
import { deleteReport, getReport, getReports } from '../../../service/api.service';
import { Spinner } from '../../UI/spinner/spinner';
import { ReportDetails } from '../../views/reports/report-details';

export type ReportTableState = 'fetching' | 'success' | 'error';

export const Reports = () => {
  const [tableState, setTableState] = React.useState('fetching' as ReportTableState);
  const [reports, setReports] = React.useState([] as ReportOverview[]);
  const [viewReport, setViewReport] = React.useState({} as GetReportResponse | undefined);
  const [btnSpinnerStates, setBtnSpinnerStates] = React.useState([] as boolean[]);

  const whenReportsSuccessfullyFetched = () => tableState === 'success';

  const shouldFetchReports = () => tableState === 'fetching';

  const shouldShowBtnSpinner = (idx: number) => btnSpinnerStates[idx];

  const shouldShowNoReportsMsg = () => whenReportsSuccessfullyFetched() && reports.length === 0;

  const getTimestampLabel = (timestamp: string) => `${new Date(parseInt(timestamp)).toLocaleString()}`;

  const getResultLabel = (className: string, confidence: number) => `${className} (${confidence.toFixed(2)}%)`;

  const removeReport = (reportIdx: number) => {
    const updatedReports = [] as ReportOverview[];

    reports.forEach((report, idx) => {
      if (idx !== reportIdx) {
        updatedReports.push(report);
      }
    });

    setReports([...updatedReports]);
    setBtnSpinnerStates(updatedReports.map((report) => false));
  };

  const handleViewDetails = (idx: number) => {
    getReport(reports[idx].reportId)
      .then((res) => {
        setViewReport(res.data);
      })
      .catch((err) => {
        setViewReport({} as GetReportResponse);
        console.error('GetReportError', { err });
      });
  };

  const handleDelete = (reportIdx: number) => {
    setBtnSpinnerStates(btnSpinnerStates.map((btnState, idx) => reportIdx === idx));

    const reportId = reports[reportIdx].reportId;

    deleteReport({ reportId })
      .then((res) => {
        removeReport(reportIdx);
      })
      .catch((err) => {
        setBtnSpinnerStates(btnSpinnerStates.map((btnState) => false));
        console.error('DeleteReportError', { err });
        alert('An error has occurred while trying to process the delete request, please try again.');
      });
  };

  React.useEffect(() => {
    if (shouldFetchReports()) {
      getReports()
        .then((res) => {
          const data = res.data as GetReportsResponse;

          setReports([...data.reports]);
          setTableState('success');
          setBtnSpinnerStates(data.reports.map((report) => false));
        })
        .catch((err) => {
          setTableState('error');
          console.error('GetReportsError', { err });
        });
    }
  }, []);

  switch (tableState) {
    case 'success':
      return (
        <>
          <div className="uk-overflow-auto">
            <table className="uk-table uk-table-divider uk-table-middle uk-table-responsive">
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
                  <tr key={idx} className="table-row">
                    <td>{getTimestampLabel(report.timestamp)}</td>
                    <td>{report.name}</td>
                    <td>{getResultLabel(report.clientClass, report.clientConfidence)}</td>
                    <td>{getResultLabel(report.serverClass, report.serverConfidence)}</td>
                    <td>
                      <button
                        className="uk-button uk-button-primary uk-width-1-1 uk-button-small"
                        type="button"
                        data-uk-toggle="target: #modal-report"
                        onClick={() => handleViewDetails(idx)}
                      >
                        {'View details'}
                      </button>

                      <div
                        className={`uk-flex uk-flex-center uk-margin-small-top ${
                          shouldShowBtnSpinner(idx) ? '' : 'hide'
                        }`}
                      >
                        <Spinner />
                      </div>
                      <button
                        className={`uk-button uk-button-danger uk-width-1-1 uk-button-small uk-margin-small-top ${
                          shouldShowBtnSpinner(idx) ? 'hide' : ''
                        }`}
                        type="button"
                        onClick={() => handleDelete(idx)}
                      >
                        {'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
                {shouldShowNoReportsMsg() && (
                  <tr>
                    <td colSpan={5}>
                      <p style={{ textAlign: 'center' }}>{'There are no reports to show for this user.'}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div id="modal-report" data-uk-modal>
              <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>

                <div className="uk-modal-header">
                  <h2 className="uk-modal-title">{'Report details'}</h2>
                </div>

                <div className="uk-modal-body" data-uk-overflow-auto>
                  <ReportDetails report={viewReport} />
                </div>

                <div className="uk-modal-footer uk-text-right">
                  <button className="uk-button uk-button-default uk-modal-close" type="button">
                    {'Close'}
                  </button>
                </div>
              </div>
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
        <div className="uk-flex uk-flex-center uk-margin-xlarge-top">
          <Spinner />
        </div>
      );

    default:
      return null;
  }
};
