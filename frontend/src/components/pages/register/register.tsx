/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../consts/routes.consts';
import { registerUser } from '../../../service/api.service';
import { Footer } from '../../layout/footer/footer';
import { Spinner } from '../../UI/spinner/spinner';

export const Register = () => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [errorFirstName, setErrorFirstName] = React.useState(false);
  const [errorLastName, setErrorLastName] = React.useState(false);
  const [errorEmail, setErrorEmail] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = React.useState(false);

  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitErrorMsg, setSubmitErrorMsg] = React.useState('');

  const validateNotEmpty = (arg: string) => arg !== '';
  const validateIdentical = (arg: string, match: string) => arg === match;
  const validateEmailFormat = (arg: string) => /.+@.+\..+/.test(arg);
  const validatePasswordFormat = (arg: string) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(arg);

  const assertValidFirstName = (arg: string) => {
    const valid = validateNotEmpty(arg);

    setErrorFirstName(!valid);
    return valid;
  };

  const assertValidLastName = (arg: string) => {
    const valid = validateNotEmpty(arg);

    setErrorLastName(!valid);
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
    const validFirstName = assertValidFirstName(firstName);
    const validLastName = assertValidLastName(lastName);
    const validEmail = assertValidEmail(email);
    const validPassword = assertValidPassword(password);
    const validConfirmPassword = assertValidConfirmPassword(confirmPassword, password);

    console.log('Validation', {
      validFirstName,
      validLastName,
      validEmail,
      validPassword,
      validConfirmPassword,
    });

    return validFirstName && validLastName && validEmail && validPassword && validConfirmPassword;
  };

  const onChangeFirstName = (ev: any) => {
    const value = ev.target.value;
    setFirstName(value);

    if (submitted) {
      assertValidFirstName(value);
    }
  };

  const onChangeLastName = (ev: any) => {
    const value = ev.target.value;
    setLastName(value);

    if (submitted) {
      assertValidLastName(value);
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
      assertValidConfirmPassword(value, confirmPassword);
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

    setSubmitted(true);

    if (!valid) {
      return;
    }

    console.log('RegisterSubmit', {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      valid,
    });

    setSubmitting(true);
    setSubmitErrorMsg('');

    registerUser({ firstName, lastName, email, password })
      .then((res) => {
        console.log('RegisterUserSuccess', { res });

        setSubmitErrorMsg('');
        setSubmitSuccess(true);
      })
      .catch((err) => {
        console.error('RegisterUserError', { err });

        if (err.response.status === 500) {
          setSubmitErrorMsg('Email is already registered, please choose a different email for your account.');
        } else {
          setSubmitErrorMsg('Something went wrong while processing your request, please try again.');
        }

        setSubmitSuccess(false);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate(AppRoutes.login);
  };

  const applyErrorStyleOn = (cond: boolean) => (cond ? 'uk-form-danger' : '');

  const shouldShowResponseErrorMessage = () => submitErrorMsg !== '';

  const shouldShowSubmitSuccessMessage = () => submitSuccess;

  return (
    <>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-xlarge-top uk-margin-xlarge-bottom">
        <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
          <h3 className="uk-card-title">{'Register account'}</h3>

          <form onSubmit={(ev) => ev.preventDefault()}>
            <fieldset className="uk-fieldset">
              <div className="uk-margin-bottom">
                <label htmlFor="register_First-Name-Field">{'First name:'}</label>

                <input
                  className={`uk-input ${applyErrorStyleOn(errorFirstName)}`}
                  id="register_First-Name-Field"
                  type="text"
                  value={firstName}
                  onChange={onChangeFirstName}
                ></input>

                {errorFirstName ? <small className="uk-text-danger">{'This field is required.'}</small> : null}
              </div>

              <div className="uk-margin-bottom">
                <label htmlFor="register_Last-Name-Field">{'Last name:'}</label>

                <input
                  className={`uk-input ${applyErrorStyleOn(errorLastName)}`}
                  id="register_Last-Name-Field"
                  type="text"
                  value={lastName}
                  onChange={onChangeLastName}
                ></input>

                {errorLastName ? <small className="uk-text-danger">{'This field is required.'}</small> : null}
              </div>

              <div className="uk-margin-bottom">
                <label htmlFor="register_Email-Field">{'Email:'}</label>

                <input
                  className={`uk-input ${applyErrorStyleOn(errorEmail)}`}
                  id="register_Email-Field"
                  type="text"
                  value={email}
                  onChange={onChangeEmail}
                ></input>

                {errorEmail ? (
                  <small className="uk-text-danger">{'Email address is not in a valid format.'}</small>
                ) : null}
              </div>

              <div className="uk-margin-bottom">
                <label htmlFor="register_Password-Field">{'Password:'}</label>

                <input
                  className={`uk-input ${applyErrorStyleOn(errorPassword)}`}
                  id="register_Password-Field"
                  type="password"
                  value={password}
                  onChange={onChangePassword}
                ></input>

                {errorPassword ? (
                  <small className="uk-text-danger">{'Password is not in a valid format.'}</small>
                ) : null}

                <br />
                <small>
                  {
                    'Password should contain at least 8 characters and at least one uppercase, one lowercase letter and at least one number. Example: passWord123'
                  }
                </small>
              </div>

              <div className="uk-margin-bottom">
                <label htmlFor="register_Confirm-Password-Field">{'Confirm password:'}</label>

                <input
                  className={`uk-input ${applyErrorStyleOn(errorConfirmPassword)}`}
                  id="register_Confirm-Password-Field"
                  type="password"
                  value={confirmPassword}
                  onChange={onChangeConfirmPassword}
                ></input>

                {errorConfirmPassword ? <small className="uk-text-danger">{'Passwords do not match.'}</small> : null}
              </div>

              <p className="uk-margin-bottom">
                {'Already have an account? '}
                <a onClick={navigateToLogin}>{'Login.'}</a>
              </p>

              <div className="uk-flex uk-flex-center">
                {submitting ? (
                  <Spinner />
                ) : (
                  <button className="uk-button uk-button-primary" onClick={onSubmit}>
                    {'Submit'}
                  </button>
                )}
              </div>
            </fieldset>
          </form>

          {shouldShowResponseErrorMessage() ? (
            <div className="uk-alert-danger uk-alert" uk-alert>
              <p>{submitErrorMsg}</p>
            </div>
          ) : null}

          {shouldShowSubmitSuccessMessage() ? (
            <div className="uk-alert-success uk-alert" uk-alert>
              <p>
                <span>{'Account registration successful! '}</span>
                <a className="uk-link-text" onClick={navigateToLogin}>
                  {'Proceed to login.'}
                </a>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
