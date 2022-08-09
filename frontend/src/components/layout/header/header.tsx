/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../consts/routes.consts';
import { logoutUser } from '../../../service/auth.service';

export const Header = () => {
  const navigate = useNavigate();

  const navigateTo = (route: string) => {
    if (window.location.pathname !== route) {
      navigate(route);
    } else {
      window.location.reload();
    }
  };

  const performLogout = () => {
    logoutUser();

    navigate(AppRoutes.logout);
  };

  const applyActiveClass = (route: string) => (window.location.pathname === route ? 'header-nav-link-active' : '');

  return (
    <>
      <div data-uk-sticky="media: 960" className="uk-navbar-container uk-sticky header">
        <div className="uk-container uk-container-expand">
          <nav className="uk-navbar">
            <div className="uk-navbar-left">
              <ul className="uk-navbar-nav">
                <li>
                  <a
                    onClick={() => navigateTo(AppRoutes.dashboard)}
                    className={`header-nav-link ${applyActiveClass(AppRoutes.dashboard)}`}
                  >
                    {'Dashboard'}
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => navigateTo(AppRoutes.reports)}
                    className={`header-nav-link ${applyActiveClass(AppRoutes.reports)}`}
                  >
                    {'Reports'}
                  </a>
                </li>
              </ul>
            </div>
            <div className="uk-navbar-right">
              <ul className="uk-navbar-nav">
                <li className={`${applyActiveClass(AppRoutes.logout)}`}>
                  <a
                    onClick={() => performLogout()}
                    className={`header-nav-link ${applyActiveClass(AppRoutes.logout)}`}
                  >
                    {'Logout'}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};
