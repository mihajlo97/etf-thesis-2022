import { useNavigate } from "react-router-dom";
import {
  DashboardView,
  SwitchDashboardView,
} from "../../../../model/dashboard.model";
import { AppRoutes } from "../../../../consts/routes.consts";
import React from "react";

export interface DefaultDashboardProps {
  transition: SwitchDashboardView;
}

export const DefaultDashboard = ({ transition }: DefaultDashboardProps) => {
  const navigate = useNavigate();

  const navigateToReports = () => {
    navigate(AppRoutes.reports);
  };

  const startNewReport = () => {
    transition(DashboardView.SELECT_UPLOAD_TYPE);
  };

  return (
    <React.Fragment>
      <div>
        <h3 style={{ textAlign: "center" }}>{"Dashboard"}</h3>

        <div>
          <button
            className="uk-button uk-button-primary uk-width-1-1"
            onClick={startNewReport}
          >
            {"Create new report"}
          </button>
        </div>

        <div className="uk-margin-top">
          <button
            className="uk-button uk-button-default uk-width-1-1"
            onClick={navigateToReports}
          >
            {"View reports"}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
