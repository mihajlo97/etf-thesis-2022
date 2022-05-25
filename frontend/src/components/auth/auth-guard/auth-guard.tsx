import React from "react";
import { Navigate } from "react-router-dom";
import { AppRoutes } from "../../../consts/routes.consts";
import {
  assertSessionStillValid,
  assertUserLoggedIn,
  doSilentRefresh,
  logoutUser,
  setSessionExpired,
} from "../../../service/auth.service";
import { Loading } from "../../pages/loading/loading";

type TargetComponent = "login" | "logout" | "loading" | "component";

export const AuthGuard = (props: any): JSX.Element => {
  const [target, setTarget] = React.useState("loading" as TargetComponent);

  React.useEffect(() => {
    if (!assertUserLoggedIn()) {
      setTarget("login");
      return;
    }

    if (!assertSessionStillValid()) {
      doSilentRefresh()
        .then(() => {
          setTarget("component");
        })
        .catch(() => {
          setSessionExpired();
          logoutUser();

          setTarget("logout");
        });
      return;
    }

    setTarget("component");
  }, []);

  switch (target) {
    case "login":
      return <Navigate to={AppRoutes.login} />;

    case "logout":
      return <Navigate to={AppRoutes.logout} />;

    case "component":
      return props.children;

    default:
      return <Loading />;
  }
};
