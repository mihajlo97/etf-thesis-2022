/* eslint-disable jsx-a11y/alt-text */
import { GetReportResponse } from '../../../model/api-response.model';

export interface ReportDetailsProps {
  report: GetReportResponse | undefined;
}

export const ReportDetails = ({ report }: ReportDetailsProps) => {
  return report ? (
    <>
      <p>{report.name}</p>
      <p>{report.model}</p>
      <img src={`data:image/png;base64,${report.image}`} />
    </>
  ) : null;
};
