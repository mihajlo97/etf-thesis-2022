/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../consts/routes";

export const Register = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate(AppRoutes.login);
  };

  return (
    <React.Fragment>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-xlarge-top">
        <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
          <h3 className="uk-card-title">{"Register account"}</h3>
          <form>
            <fieldset className="uk-fieldset">
              <label htmlFor="register_Name-Field">{"Name:"}</label>
              <input
                className="uk-input uk-margin-bottom"
                id="register_Name-Field"
                type="text"
              ></input>

              <label htmlFor="register_Email-Field">{"Email:"}</label>
              <input
                className="uk-input uk-margin-bottom"
                id="register_Email-Field"
                type="text"
              ></input>

              <label htmlFor="register_Password-Field">{"Password:"}</label>
              <input
                className="uk-input uk-margin-bottom"
                id="register_Password-Field"
                type="password"
              ></input>

              <label htmlFor="register_Confirm-Password-Field">
                {"Confirm password:"}
              </label>
              <input
                className="uk-input"
                id="register_Confirm-Password-Field"
                type="password"
              ></input>

              <p className="uk-margin-bottom">
                {"Already have an account? "}
                <a onClick={navigateToLogin}>{"Login."}</a>
              </p>

              <div className="uk-flex uk-flex-center">
                <button className="uk-button uk-button-primary">
                  {"Submit"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};
