/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import { GetReportResponse, GetReportsResponse } from '../../../model/api-response.model';
import { ReportOverview } from '../../../model/report.model';
import { deleteReport, getReport, getReports } from '../../../service/api.service';
import { Chevron, ChevronDirection } from '../../UI/chevron/chevron';
import { SortHeader } from '../../UI/sort-header/sort-header';
import { Spinner } from '../../UI/spinner/spinner';
import { ReportDetails, ReportDetailsState } from '../../views/reports/report-details/report-details';

export type ReportTableState = 'fetching' | 'success' | 'error';

export type SortOrder = 'asc' | 'desc';

export type ResultSort = 'class' | 'confidence';

export type ResultOrigin = 'client' | 'server';

export const Reports = () => {
  const [tableState, setTableState] = React.useState('fetching' as ReportTableState);
  const [reports, setReports] = React.useState([] as ReportOverview[]);
  const [searchValue, setSearchValue] = React.useState('');
  const [viewReport, setViewReport] = React.useState({} as GetReportResponse);
  const [modalDisplay, setModalDisplay] = React.useState('loading' as ReportDetailsState);
  const [btnSpinnerStates, setBtnSpinnerStates] = React.useState([] as boolean[]);
  const [hideReports, setHideReports] = React.useState([] as boolean[]);
  const [sortResultsBy, setSortResultsBy] = React.useState('class' as ResultSort);
  const [sortChevronStates, setSortChevronStates] = React.useState([
    'down',
    'down',
    'down',
    'down',
  ] as ChevronDirection[]);

  const tableHeadersSortable = ['Timestamp', 'Report', 'Client results', 'Server results'];
  const resultSortOptions = ['Class names', 'Result confidence'];

  const whenReportsSuccessfullyFetched = () => tableState === 'success';

  const shouldFetchReports = () => tableState === 'fetching';

  const shouldShowBtnSpinner = (idx: number) => btnSpinnerStates[idx];

  const shouldShowNoReportsMsg = () => whenReportsSuccessfullyFetched() && reports.length === 0;

  const shouldShowReportRow = (idx: number) => !hideReports[idx];

  const flipChevronState = (state: ChevronDirection) => (state === 'down' ? 'up' : 'down');

  const getTimestampLabel = (timestamp: string) => `${new Date(parseInt(timestamp)).toLocaleString()}`;

  const getResultLabel = (className: string, confidence: number) => `${className} (${confidence.toFixed(2)}%)`;

  const sortByTimestamp = (order: SortOrder) => {
    setReports(
      [...reports].sort((a, b) =>
        order === 'desc' ? parseInt(a.timestamp) - parseInt(b.timestamp) : parseInt(b.timestamp) - parseInt(a.timestamp)
      )
    );
  };

  const sortByName = (order: SortOrder) => {
    setReports(
      [...reports].sort((a, b) => (order === 'desc' ? a.name.localeCompare(b.name) : -a.name.localeCompare(b.name)))
    );
  };

  const sortByResults = (order: SortOrder, sortBy: ResultSort, origin: ResultOrigin) => {
    if (origin === 'client') {
      setReports(
        [...reports].sort((a, b) => {
          if (sortBy === 'class') {
            return order === 'desc'
              ? a.clientClass.localeCompare(b.clientClass)
              : -a.clientClass.localeCompare(b.clientClass);
          }

          return order === 'desc' ? a.clientConfidence - b.clientConfidence : b.clientConfidence - a.clientConfidence;
        })
      );
      return;
    }

    setReports(
      [...reports].sort((a, b) => {
        if (sortBy === 'class') {
          return order === 'desc'
            ? a.serverClass.localeCompare(b.serverClass)
            : -a.serverClass.localeCompare(b.serverClass);
        }

        return order === 'desc' ? a.serverConfidence - b.serverConfidence : b.serverConfidence - a.serverConfidence;
      })
    );
  };

  const applySearchFilter = (reports: ReportOverview[], value: string): boolean[] => {
    if (!value || value === '') {
      return reports.map((report) => false);
    }

    return reports.map((report) => {
      const val = value.toLocaleLowerCase();
      const { name, clientClass, serverClass } = report;

      return (
        name.toLocaleLowerCase().search(val) < 0 &&
        clientClass.toLocaleLowerCase().search(val) < 0 &&
        serverClass.toLocaleLowerCase().search(val) < 0
      );
    });
  };

  const removeReport = (reportIdx: number) => {
    const updatedReports = [] as ReportOverview[];

    reports.forEach((report, idx) => {
      if (idx !== reportIdx) {
        updatedReports.push(report);
      }
    });

    setReports([...updatedReports]);
    setBtnSpinnerStates(updatedReports.map((report) => false));
    setHideReports(applySearchFilter(updatedReports, searchValue));
  };

  const handleViewDetails = (idx: number) => {
    setModalDisplay('loading');

    getReport(reports[idx].reportId)
      .then((res) => {
        setViewReport(res.data);
        setModalDisplay('report');
      })
      .catch((err) => {
        setViewReport({} as GetReportResponse);
        setModalDisplay('error');

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
        alert('An error has occurred while trying to process the delete request, please try again.');

        console.error('DeleteReportError', { err });
      });
  };

  const handleSort = (id: number) => {
    if (id < 0) {
      return;
    }

    const order = (sortChevronStates[id] === 'down' ? 'desc' : 'asc') as SortOrder;

    setSortChevronStates(sortChevronStates.map((state, idx) => (id === idx ? flipChevronState(state) : state)));

    switch (id) {
      case 0:
        sortByTimestamp(order);
        break;

      case 1:
        sortByName(order);
        break;

      case 2:
        sortByResults(order, sortResultsBy, 'client');
        break;

      case 3:
        sortByResults(order, sortResultsBy, 'server');
        break;

      default:
    }
  };

  const handleSelect = (event: any) => {
    setSortResultsBy(event.target.value === resultSortOptions[0] ? 'class' : 'confidence');
  };

  const handleSearch = (event: any) => {
    const val = event.target.value;

    setSearchValue(val);
    setHideReports(applySearchFilter(reports, val));
  };

  React.useEffect(() => {
    if (shouldFetchReports()) {
      getReports()
        .then((res) => {
          const data = res.data as GetReportsResponse;

          setReports([...data.reports]);
          setTableState('success');
          setBtnSpinnerStates(data.reports.map((report) => false));
          setHideReports(data.reports.map((report) => false));
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
          <div className="uk-padding-small uk-flex uk-flex-between@s">
            <div>
              <label htmlFor="sort-select">{'Toggle result sorting by: '}</label>
              <br />
              <select
                id="sort-select"
                className="uk-select uk-margin-small-top uk-form-width-medium uk-form-small"
                onChange={handleSelect}
              >
                {resultSortOptions.map((option, idx) => (
                  <option key={idx}>{option}</option>
                ))}
              </select>
            </div>

            <div className="uk-margin-left">
              <label htmlFor="search">{'Search in table: '}</label>
              <br />
              <input type="text" className="uk-input uk-margin-small-top uk-form-small" onChange={handleSearch} />
            </div>
          </div>

          <hr className="no-margins" />

          <div className="uk-overflow-auto">
            <table className="uk-table uk-table-divider uk-table-middle uk-table-responsive">
              <thead>
                <tr>
                  {tableHeadersSortable.map((header, idx) => (
                    <th key={idx}>
                      <SortHeader
                        text={header}
                        direction={sortChevronStates[idx]}
                        onSortArgs={idx}
                        onSortClick={handleSort}
                      />
                    </th>
                  ))}
                  <th>{'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, idx) =>
                  shouldShowReportRow(idx) ? (
                    <tr key={idx}>
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
                  ) : null
                )}
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
              <div className="uk-modal-dialog modal-dims">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>

                <div className="uk-modal-header">
                  <h2 className="uk-modal-title">{'Report details'}</h2>
                </div>

                <div className="uk-modal-body" data-uk-overflow-auto>
                  <ReportDetails report={viewReport} display={modalDisplay} />
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
