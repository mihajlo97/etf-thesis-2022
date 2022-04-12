/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../consts/routes.consts";
import { loginUser } from "../../../service/API/user.service";
import { Footer } from "../../layout/footer/footer";
import { Spinner } from "../../UI/spinner/spinner";

export const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const onChangeEmail = (ev: any) => {
    setEmail(ev.target.value);
  };

  const onChangePassword = (ev: any) => {
    setPassword(ev.target.value);
  };

  const onSubmit = () => {
    console.log("LoginSubmit", { email, password });

    setSubmitting(true);

    loginUser({ email, password }).then(() => {
      setSubmitting(false);
      setError(true);
    });
  };

  const navigate = useNavigate();

  const navigateToRegister = () => {
    navigate(AppRoutes.register);
  };

  return (
    <React.Fragment>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-xlarge-top">
        <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
          <h3 className="uk-card-title">{"Welcome to $PROJ_NAME!"}</h3>

          <form onSubmit={(ev) => ev.preventDefault()}>
            <fieldset className="uk-fieldset">
              <label htmlFor="login_Email-Field">{"Email:"}</label>
              <input
                className="uk-input uk-margin-bottom"
                id="login_Email-Field"
                type="text"
                value={email}
                onChange={onChangeEmail}
              ></input>

              <label htmlFor="login_Password-Field">{"Password:"}</label>
              <input
                className="uk-input"
                id="login_Password-Field"
                type="password"
                value={password}
                onChange={onChangePassword}
              ></input>

              {error ? (
                <p className="uk-text-danger">{"Invalid credentials."}</p>
              ) : null}

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
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};
