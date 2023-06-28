/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import { GetReportResponse, GetReportsResponse } from '../../../model/api-response.model';
import { ReportOverview } from '../../../model/report.model';
import { deleteReport, getReport, getReports } from '../../../service/api.service';
import { ChevronDirection } from '../../UI/chevron/chevron';
import { SortHeader } from '../../UI/sort-header/sort-header';
import { Spinner } from '../../UI/spinner/spinner';
import { ReportDetails, ReportDetailsState } from '../../views/reports/report-details/report-details';

export type ReportTableState = 'fetching' | 'success' | 'error';

export type SortOrder = 'asc' | 'desc';

export type ResultSort = 'class' | 'confidence';

export type ResultOrigin = 'client' | 'server';

export type SortByCategory = 'timestamp' | 'name' | 'clientResults' | 'serverResults';

export interface SortOptions {
  order: SortOrder;
  sortBy: SortByCategory;
}

export const Reports = () => {
  const [tableState, setTableState] = React.useState('fetching' as ReportTableState);
  const [allReports, setAllReports] = React.useState([] as ReportOverview[]);
  const [reportsToRender, setReportsToRender] = React.useState([] as ReportOverview[]);
  const [searchValue, setSearchValue] = React.useState('');
  const [viewReport, setViewReport] = React.useState({} as GetReportResponse);
  const [modalDisplay, setModalDisplay] = React.useState('loading' as ReportDetailsState);
  const [btnSpinnerStates, setBtnSpinnerStates] = React.useState([] as boolean[]);
  const [latestSortOptions, setLatestSortOptions] = React.useState({} as SortOptions);
  const [sortResultsBy, setSortResultsBy] = React.useState('class' as ResultSort);
  const [sortChevronStates, setSortChevronStates] = React.useState([
    'up',
    'down',
    'down',
    'down',
  ] as ChevronDirection[]);

  const tableHeadersSortable = ['Timestamp', 'Report', 'Client results', 'Server results'];
  const resultSortOptions = ['Class names', 'Result confidence'];

  const whenReportsSuccessfullyFetched = () => tableState === 'success';

  const whenNoReports = () => allReports.length === 0;

  const shouldFetchReports = () => tableState === 'fetching';

  const shouldShowBtnSpinner = (idx: number) => btnSpinnerStates[idx];

  const shouldShowNoReportsMsg = () => whenReportsSuccessfullyFetched() && whenNoReports();

  const getSortOrder = (sortChevronStateIdx: number) =>
    (sortChevronStates[sortChevronStateIdx] === 'down' ? 'desc' : 'asc') as SortOrder;

  const getSelectedReportId = (id: number) => reportsToRender[id].reportId;

  const getTimestampLabel = (timestamp: string) => `${new Date(parseInt(timestamp)).toLocaleString()}`;

  const getResultLabel = (className: string, confidence: number) => `${className} (${confidence.toFixed(2)}%)`;

  const getSortCategory = (headerId: number): SortByCategory => {
    switch (headerId) {
      case 0:
        return 'timestamp';
      case 1:
        return 'name';
      case 2:
        return 'clientResults';
      case 3:
        return 'serverResults';
      default:
        return 'timestamp';
    }
  };

  const toggleSortChevronState = (state: ChevronDirection) => (state === 'down' ? 'up' : 'down');

  const updateSortChevronStates = (sortChevronStateIdx: number) =>
    setSortChevronStates(
      sortChevronStates.map((state, idx) => (sortChevronStateIdx === idx ? toggleSortChevronState(state) : state))
    );

  const resetBtnSpinnerStates = (source: ReportOverview[]) => setBtnSpinnerStates(source.map((report) => false));

  const updateBtnSpinnerState = (btnStateIdx: number, value: boolean) =>
    setBtnSpinnerStates(btnSpinnerStates.map((state, idx) => (btnStateIdx === idx ? value : state)));

  const updateAllReports = (source: ReportOverview[]) => setAllReports([...source]);

  const updateReportsToRender = (source: ReportOverview[]) => setReportsToRender([...source]);

  const sortSourceByTimestamp = (source: ReportOverview[], order: SortOrder) =>
    [...source].sort((a, b) =>
      order === 'desc' ? parseInt(a.timestamp) - parseInt(b.timestamp) : parseInt(b.timestamp) - parseInt(a.timestamp)
    );

  const sortSourceByName = (source: ReportOverview[], order: SortOrder) =>
    [...source].sort((a, b) => (order === 'desc' ? a.name.localeCompare(b.name) : -a.name.localeCompare(b.name)));

  const sortSourceByResults = (
    source: ReportOverview[],
    order: SortOrder,
    sortBy: ResultSort,
    origin: ResultOrigin
  ) => {
    if (origin === 'client') {
      return [...source].sort((a, b) => {
        if (sortBy === 'class') {
          return order === 'desc'
            ? a.clientClass.localeCompare(b.clientClass)
            : -a.clientClass.localeCompare(b.clientClass);
        }

        return order === 'desc' ? a.clientConfidence - b.clientConfidence : b.clientConfidence - a.clientConfidence;
      });
    }

    return [...source].sort((a, b) => {
      if (sortBy === 'class') {
        return order === 'desc'
          ? a.serverClass.localeCompare(b.serverClass)
          : -a.serverClass.localeCompare(b.serverClass);
      }

      return order === 'desc' ? a.serverConfidence - b.serverConfidence : b.serverConfidence - a.serverConfidence;
    });
  };

  const filterSourceBySearchValue = (source: ReportOverview[], value: string) => {
    if (!value || value === '') {
      return [...allReports];
    }

    return source.filter((report) => {
      const val = value.toLocaleLowerCase();
      const { name, clientClass, serverClass } = report;

      return (
        name.toLocaleLowerCase().search(val) >= 0 ||
        clientClass.toLocaleLowerCase().search(val) >= 0 ||
        serverClass.toLocaleLowerCase().search(val) >= 0
      );
    });
  };

  const filterAndSortSource = (source: ReportOverview[], searchVal: string, sortOpt: SortOptions) => {
    const filtered = filterSourceBySearchValue(source, searchVal);

    const { sortBy, order } = sortOpt;

    switch (sortBy) {
      case 'timestamp':
        return sortSourceByTimestamp(filtered, order);

      case 'name':
        return sortSourceByName(filtered, order);

      case 'clientResults':
        return sortSourceByResults(filtered, order, sortResultsBy, 'client');

      case 'serverResults':
        return sortSourceByResults(filtered, order, sortResultsBy, 'server');

      default:
        return filtered;
    }
  };

  const removeReportFromSource = (source: ReportOverview[], reportId: string) => {
    const updatedReports = [] as ReportOverview[];

    source.forEach((report, idx) => {
      if (report.reportId !== reportId) {
        updatedReports.push(report);
      }
    });

    return updatedReports;
  };

  const handleSearch = (event: any) => {
    const value = event.target.value;
    const updatedReportsToRender = filterAndSortSource(allReports, value, latestSortOptions);

    updateReportsToRender(updatedReportsToRender);
    setSearchValue(value);
  };

  const handleSelect = (event: any) =>
    setSortResultsBy(event.target.value === resultSortOptions[0] ? 'class' : 'confidence');

  const handleSort = (sortCategoryIdx: number) => {
    if (sortCategoryIdx < 0) {
      return;
    }

    const order = getSortOrder(sortCategoryIdx);
    const sortBy = getSortCategory(sortCategoryIdx);
    const sortOptions = { order, sortBy } as SortOptions;

    const updatedReportsToRender = filterAndSortSource(reportsToRender, searchValue, sortOptions);

    updateSortChevronStates(sortCategoryIdx);
    updateReportsToRender(updatedReportsToRender);
    setLatestSortOptions(sortOptions);
  };

  const handleViewDetails = (idx: number) => {
    if (idx < 0) {
      return;
    }

    const reportId = getSelectedReportId(idx);

    getReport(reportId)
      .then((res) => {
        setViewReport(res.data);
        setModalDisplay('report');
      })
      .catch((err) => {
        setViewReport({} as GetReportResponse);
        setModalDisplay('error');

        console.error('GetReportError', { err });
      });

    setModalDisplay('loading');
  };

  const handleDelete = (reportIdx: number) => {
    if (reportIdx < 0) {
      return;
    }

    const reportId = getSelectedReportId(reportIdx);

    deleteReport({ reportId })
      .then((res) => {
        const updatedReportsToRender = removeReportFromSource(reportsToRender, reportId);
        const updatedReports = removeReportFromSource(allReports, reportId);

        resetBtnSpinnerStates(updatedReportsToRender);
        updateReportsToRender(updatedReportsToRender);
        updateAllReports(updatedReports);
      })
      .catch((err) => {
        resetBtnSpinnerStates(reportsToRender);
        alert('An error has occurred while trying to process the delete request, please try again.');

        console.error('DeleteReportError', { err });
      });

    updateBtnSpinnerState(reportIdx, true);
  };

  React.useEffect(() => {
    if (shouldFetchReports()) {
      getReports()
        .then((res) => {
          const data = res.data as GetReportsResponse;
          const userReports = data.reports;

          updateReportsToRender(userReports);
          updateAllReports(userReports);
          resetBtnSpinnerStates(userReports);
          setTableState('success');
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
                {reportsToRender.map((report, idx) => (
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
                        {'Delete report'}
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
