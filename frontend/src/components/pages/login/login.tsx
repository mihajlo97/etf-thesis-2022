/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../consts/routes.consts";
import { Footer } from "../../layout/footer/footer";

export const Login = () => {
  const navigate = useNavigate();

  const navigateToRegister = () => {
    navigate(AppRoutes.register);
  };

  return (
    <React.Fragment>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-xlarge-top">
        <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
          <h3 className="uk-card-title">{"Welcome to $PROJ_NAME!"}</h3>
          <form>
            <fieldset className="uk-fieldset">
              <label htmlFor="login_Email-Field">{"Email:"}</label>
              <input
                className="uk-input uk-margin-bottom"
                id="login_Email-Field"
                type="text"
              ></input>

              <label htmlFor="login_Password-Field">{"Password:"}</label>
              <input
                className="uk-input"
                id="login_Password-Field"
                type="password"
              ></input>

              <p className="uk-margin-bottom">
                {"Don't have an account? "}
                <a onClick={navigateToRegister}>{"Register new account."}</a>
              </p>

              <div className="uk-flex uk-flex-center">
                <button className="uk-button uk-button-primary">
                  {"Login"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};
