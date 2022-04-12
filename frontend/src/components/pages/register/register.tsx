/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../consts/routes";
import { Spinner } from "../../UI/spinner/spinner";

export const Register = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [errorName, setErrorName] = React.useState(false);
  const [errorEmail, setErrorEmail] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = React.useState(false);

  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const validateNotEmpty = (arg: string) => arg !== "";
  const validateIdentical = (arg: string, match: string) => arg === match;
  const validateEmailFormat = (arg: string) => /.+@.+\..+/.test(arg);
  const validatePasswordFormat = (arg: string) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(arg);

  const assertValidName = (arg: string) => {
    const valid = validateNotEmpty(arg);

    setErrorName(!valid);
    return valid;
  };

  const assertValidEmail = (arg: string) => {
    const valid = validateEmailFormat(arg);

    setErrorEmail(!valid);
    return valid;
  };

  const assertValidPassword = (arg: string) => {
    const valid = validatePasswordFormat(arg);

    setErrorPassword(!valid);
    return valid;
  };

  const assertValidConfirmPassword = (arg: string, match: string) => {
    const valid = validateIdentical(arg, match) && validateNotEmpty(arg);

    setErrorConfirmPassword(!valid);
    return valid;
  };

  const assertValidForm = () => {
    const validName = assertValidName(name);
    const validEmail = assertValidEmail(email);
    const validPassword = assertValidPassword(password);
    const validConfirmPassword = assertValidConfirmPassword(
      confirmPassword,
      password
    );

    console.log("Validation", {
      validName,
      validEmail,
      validPassword,
      validConfirmPassword,
    });

    return validName && validEmail && validPassword && validConfirmPassword;
  };

  const onChangeName = (ev: any) => {
    const value = ev.target.value;
    setName(value);

    if (submitted) {
      assertValidName(value);
    }
  };

  const onChangeEmail = (ev: any) => {
    const value = ev.target.value;
    setEmail(value);

    if (submitted) {
      assertValidEmail(value);
    }
  };

  const onChangePassword = (ev: any) => {
    const value = ev.target.value;
    setPassword(value);

    if (submitted) {
      assertValidPassword(value);
    }
  };

  const onChangeConfirmPassword = (ev: any) => {
    const value = ev.target.value;
    setConfirmPassword(value);

    if (submitted) {
      assertValidConfirmPassword(value, password);
    }
  };

  const onSubmit = () => {
    const valid = assertValidForm();

    console.log("FormSubmit", {
      name,
      email,
      password,
      confirmPassword,
      valid,
    });

    setSubmitted(true);
  };

  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate(AppRoutes.login);
  };

  const applyErrorStyleOn = (cond: boolean) => (cond ? "uk-form-danger" : "");

  return (
    <React.Fragment>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-xlarge-top">
        <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
          <h3 className="uk-card-title">{"Register account"}</h3>

          <form onSubmit={(ev) => ev.preventDefault()}>
            <fieldset className="uk-fieldset">
              <div className="uk-margin-bottom">
                <label htmlFor="register_Name-Field">{"Name:"}</label>

                <input
                  className={`uk-input ${applyErrorStyleOn(errorName)}`}
                  id="register_Name-Field"
                  type="text"
                  value={name}
                  onChange={onChangeName}
                ></input>

                {errorName ? (
                  <small className="uk-text-danger">
                    {"This field is required."}
                  </small>
                ) : null}
              </div>

              <div className="uk-margin-bottom">
                <label htmlFor="register_Email-Field">{"Email:"}</label>

                <input
                  className={`uk-input ${applyErrorStyleOn(errorEmail)}`}
                  id="register_Email-Field"
                  type="text"
                  value={email}
                  onChange={onChangeEmail}
                ></input>

                {errorEmail ? (
                  <small className="uk-text-danger">
                    {"Email address is not in a valid format."}
                  </small>
                ) : null}
              </div>

              <div className="uk-margin-bottom">
                <label htmlFor="register_Password-Field">{"Password:"}</label>

                <input
                  className={`uk-input ${applyErrorStyleOn(errorPassword)}`}
                  id="register_Password-Field"
                  type="password"
                  value={password}
                  onChange={onChangePassword}
                ></input>

                {errorPassword ? (
                  <small className="uk-text-danger">
                    {"Password is not in a valid format."}
                  </small>
                ) : null}

                <br />
                <small>
                  {
                    "Password should contain at least 8 characters and at least one uppercase, one lowercase letter and at least one number. Example: passWord123"
                  }
                </small>
              </div>

              <div className="uk-margin-bottom">
                <label htmlFor="register_Confirm-Password-Field">
                  {"Confirm password:"}
                </label>

                <input
                  className={`uk-input ${applyErrorStyleOn(
                    errorConfirmPassword
                  )}`}
                  id="register_Confirm-Password-Field"
                  type="password"
                  value={confirmPassword}
                  onChange={onChangeConfirmPassword}
                ></input>

                {errorConfirmPassword ? (
                  <small className="uk-text-danger">
                    {"Passwords do not match."}
                  </small>
                ) : null}
              </div>

              <p className="uk-margin-bottom">
                {"Already have an account? "}
                <a onClick={navigateToLogin}>{"Login."}</a>
              </p>

              <div className="uk-flex uk-flex-center">
                {submitting ? (
                  <Spinner />
                ) : (
                  <button
                    className="uk-button uk-button-primary"
                    onClick={onSubmit}
                  >
                    {"Submit"}
                  </button>
                )}
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};
