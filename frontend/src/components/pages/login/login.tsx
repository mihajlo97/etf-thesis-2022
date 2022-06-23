/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../consts/routes.consts";
import { loginUserWithCredentials } from "../../../service/auth.service";
import { Footer } from "../../layout/footer/footer";
import { Spinner } from "../../UI/spinner/spinner";

export const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);

  const [submitErrorMsg, setSubmitErrorMsg] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const navigate = useNavigate();

  const navigateToRegister = () => {
    navigate(AppRoutes.register);
  };

  const navigateToDashboard = () => {
    navigate(AppRoutes.dashboard);
  };

  const validateNotEmpty = (arg: string) => arg !== "";

  const assertValidEmail = (value: string) => {
    const valid = validateNotEmpty(value);

    setEmailError(!valid);
    return valid;
  };

  const assertValidPassword = (value: string) => {
    const valid = validateNotEmpty(value);

    setPasswordError(!valid);
    return valid;
  };

  const assertValidForm = () => {
    const validEmail = assertValidEmail(email);
    const validPassword = assertValidPassword(password);

    return validEmail && validPassword;
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

  const onSubmit = () => {
    console.log("LoginSubmit", { email, password });

    setSubmitted(true);

    if (!assertValidForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitErrorMsg("");

    loginUserWithCredentials({ email, password })
      .then((successStatus) => {
        setSubmitting(false);
        setSubmitErrorMsg("");

        navigateToDashboard();
      })
      .catch((errorStatus) => {
        setSubmitting(false);

        if (errorStatus === 404) {
          setSubmitErrorMsg(
            "Login failed, user could not be found, please try again."
          );
        } else if (errorStatus === 401) {
          setSubmitErrorMsg(
            "Login failed, the used password is incorrect, please try again."
          );
        } else {
          setSubmitErrorMsg(
            "Login failed, something went wrong while processing your request, please try again."
          );
        }
      });
  };

  const shouldShowResponseErrorMessage = () => submitErrorMsg !== "";

  const applyErrorStyleOn = (cond: boolean) => (cond ? "uk-form-danger" : "");

  return (
    <React.Fragment>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-xlarge-top">
        <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
          <h3 className="uk-card-title">{"Welcome to Recognize That!"}</h3>

          <form onSubmit={(ev) => ev.preventDefault()}>
            <fieldset className="uk-fieldset">
              <div className="uk-margin-bottom">
                <label htmlFor="login_Email-Field">{"Email:"}</label>

                <input
                  className={`uk-input ${applyErrorStyleOn(emailError)}`}
                  id="login_Email-Field"
                  type="text"
                  value={email}
                  onChange={onChangeEmail}
                ></input>

                {emailError ? (
                  <small className="uk-text-danger">
                    {"Please enter your email."}
                  </small>
                ) : null}
              </div>

              <div className="uk-margin-bottom">
                <label htmlFor="login_Password-Field">{"Password:"}</label>

                <input
                  className={`uk-input ${applyErrorStyleOn(passwordError)}`}
                  id="login_Password-Field"
                  type="password"
                  value={password}
                  onChange={onChangePassword}
                ></input>

                {passwordError ? (
                  <small className="uk-text-danger">
                    {"Please enter your password."}
                  </small>
                ) : null}
              </div>

              <p className="uk-margin-bottom">
                {"Don't have an account? "}
                <a onClick={navigateToRegister}>{"Register new account."}</a>
              </p>

              <div className="uk-flex uk-flex-center">
                {submitting ? (
                  <Spinner />
                ) : (
                  <button
                    className="uk-button uk-button-primary"
                    onClick={onSubmit}
                  >
                    {"Login"}
                  </button>
                )}
              </div>
            </fieldset>
          </form>

          {shouldShowResponseErrorMessage() ? (
            <div className="uk-alert-danger uk-alert" data-uk-alert>
              <a className="uk-alert-close" data-uk-close></a>
              <p>{submitErrorMsg}</p>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};
