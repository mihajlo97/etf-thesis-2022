import { useNavigate } from 'react-router-dom';
import { DashboardView, SwitchDashboardView } from '../../../../model/dashboard.model';
import { AppRoutes } from '../../../../consts/routes.consts';

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
    <>
      <div>
        <h4 style={{ textAlign: 'center' }}>{'Dashboard'}</h4>
        <hr />

        <button className="uk-button uk-button-primary uk-width-1-1 uk-margin-top" onClick={startNewReport}>
          {'Create new report'}
        </button>

        <button className="uk-button uk-button-default uk-width-1-1 uk-margin-top" onClick={navigateToReports}>
          {'View reports'}
        </button>
      </div>
    </>
  );
};
