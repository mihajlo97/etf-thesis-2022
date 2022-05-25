import { Navigate } from "react-router-dom";
import { AppRoutes } from "../../../consts/routes.consts";
import {
  assertUserLoggedIn,
  clearSessionExpiredLogout,
} from "../../../service/auth.service";

export const AuthGuard = (props: any): JSX.Element => {
  if (!assertUserLoggedIn()) {
    return <Navigate to={AppRoutes.login} />;
  }

  clearSessionExpiredLogout();

  return props.children;
};
