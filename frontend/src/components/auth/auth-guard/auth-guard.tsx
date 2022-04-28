import { Navigate, useLocation } from "react-router-dom";
import { AppRoutes } from "../../../consts/routes.consts";
import { assertUserLoggedIn } from "../../../service/auth.service";

export const AuthGuard = (props: any): JSX.Element => {
  if (!assertUserLoggedIn()) {
    return <Navigate to={AppRoutes.login} />;
  }

  return props.children;
};
