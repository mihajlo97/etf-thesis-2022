import { useNavigate } from "react-router-dom";
import {
  DashboardView,
  SwitchDashboardView,
} from "../../../../consts/dashboard.consts";
import { AppRoutes } from "../../../../consts/routes.consts";

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
    <div>
      <h3 style={{ textAlign: "center" }}>{"Dashboard"}</h3>

      <div className="uk-padding-small">
        <button
          className="uk-button uk-button-primary uk-width-1-1"
          onClick={startNewReport}
        >
          {"Create new report"}
        </button>
      </div>

      <div className="uk-padding-small">
        <button
          className="uk-button uk-button-default uk-width-1-1"
          onClick={navigateToReports}
        >
          {"View reports"}
        </button>
      </div>
    </div>
  );
};
