/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../consts/routes.consts";
import { Footer } from "../../layout/footer/footer";

export const Logout = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => navigate(AppRoutes.login);

  return (
    <React.Fragment>
      <div className="uk-flex uk-flex-row uk-flex-center uk-margin-large-top">
        <div className="uk-card uk-width-1-2@m">
          <div className="uk-alert-success uk-alert uk-padding" data-uk-alert>
            <a className="uk-alert-close" data-uk-close></a>
            <p style={{ textAlign: "center" }}>
              {"You have been successfully logged out!"}
              <br />
              <a className="uk-link-text" onClick={navigateToLogin}>
                {"Return to login."}
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
