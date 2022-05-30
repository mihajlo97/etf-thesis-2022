import React from "react";
import { DashboardView } from "../../../consts/dashboard.consts";
import { Waiting } from "../../views/dashboard/waiting/waiting";
import { DefaultDashboard } from "../../views/dashboard/default_dashboard/default-dashboard";
import { Results } from "../../views/dashboard/results/results";
import { SelectUploadType } from "../../views/dashboard/select_upload_type/select-upload-type";
import { Settings } from "../../views/dashboard/settings/settings";
import { Webcam } from "../../views/dashboard/webcam/webcam";

export const Dashboard = () => {
  const [dashboardView, setDashboardView] = React.useState(
    DashboardView.INITIAL
  );

  const switchToView = (view: DashboardView) => {
    setDashboardView(view);
  };

  const renderView = (view: DashboardView): JSX.Element | null => {
    switch (view) {
      case DashboardView.INITIAL:
        return <DefaultDashboard transition={switchToView} />;

      case DashboardView.SELECT_UPLOAD_TYPE:
        return <SelectUploadType transition={switchToView} />;

      case DashboardView.UPLOADING:
        return <Waiting transition={switchToView} text="Uploading..." />;

      case DashboardView.WEBCAM:
        return <Webcam transition={switchToView} />;

      case DashboardView.SETTINGS:
        return <Settings transition={switchToView} />;

      case DashboardView.PROCESSING:
        return <Waiting transition={switchToView} text="Processing..." />;

      case DashboardView.RESULTS:
        return <Results transition={switchToView} />;

      default:
        return null;
    }
  };

  return (
    <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-large-top">
      <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
        <div className="uk-flex uk-flex-center uk-padding-large">
          {renderView(dashboardView)}
        </div>
      </div>
    </div>
  );
};
