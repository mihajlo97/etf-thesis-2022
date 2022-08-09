/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../consts/routes.consts';
import { assertSessionExpiredLogout } from '../../../service/auth.service';
import { Footer } from '../../layout/footer/footer';

export const Logout = () => {
  const [expired, setExpired] = React.useState(assertSessionExpiredLogout());

  const navigate = useNavigate();

  const navigateToLogin = () => navigate(AppRoutes.login);

  const decideAlertStyle = (): string => `${expired ? 'uk-alert-warning' : 'uk-alert-success'} uk-alert uk-padding`;

  const decideAlertText = (): string =>
    `${expired ? 'Session has expired, please login again.' : 'You have been successfully logged out!'}`;

  return (
    <>
      <div className="uk-flex uk-flex-row uk-flex-center uk-margin-large-top">
        <div className="uk-card uk-width-1-2@m">
          <div className={decideAlertStyle()} data-uk-alert>
            <a className="uk-alert-close" data-uk-close></a>
            <p style={{ textAlign: 'center' }}>
              {decideAlertText()}
              <br />
              <a className="uk-link-text" onClick={navigateToLogin}>
                {'Return to login.'}
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
