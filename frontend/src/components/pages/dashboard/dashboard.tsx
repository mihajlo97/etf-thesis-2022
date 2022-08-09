/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import { DashboardView, ReportArgs } from '../../../model/dashboard.model';
import { removeUploadedImages } from '../../../service/image.service';

import { DefaultDashboard } from '../../views/dashboard/default_dashboard/default-dashboard';
import { Report } from '../../views/dashboard/report/report';
import { SelectUploadType } from '../../views/dashboard/select_upload_type/select-upload-type';
import { Settings } from '../../views/dashboard/settings/settings';
import { WebcamWindow } from '../../views/dashboard/webcam-window/webcam-window';

export const Dashboard = () => {
  const [view, setView] = React.useState(DashboardView.INITIAL);
  const [viewArgs, setViewArgs] = React.useState(undefined);

  const switchToView = (view: DashboardView, args?: any) => {
    setView(view);

    if (args) {
      setViewArgs(args);
    }
  };

  const renderView = (view: DashboardView): JSX.Element | null => {
    switch (view) {
      case DashboardView.INITIAL:
        return <DefaultDashboard transition={switchToView} />;

      case DashboardView.SELECT_UPLOAD_TYPE:
        return <SelectUploadType transition={switchToView} />;

      case DashboardView.WEBCAM:
        return <WebcamWindow transition={switchToView} />;

      case DashboardView.SETTINGS:
        return <Settings transition={switchToView} />;

      case DashboardView.REPORT:
        return <Report args={viewArgs ?? ({} as ReportArgs)} transition={switchToView} />;

      default:
        return null;
    }
  };

  React.useEffect(() => {
    if (view === DashboardView.INITIAL) {
      removeUploadedImages();
    }
  }, [view]);

  return (
    <>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-large-top">
        <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m">{renderView(view)}</div>
      </div>
    </>
  );
};
