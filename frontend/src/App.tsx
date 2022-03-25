import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { Login } from "./components/pages/login/login";
import { PageNotFound } from "./components/pages/page-not-found/page-not-found";
import { Register } from "./components/pages/register/register";
import { AppRoutes } from "./consts/routes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={AppRoutes.root}
          element={<Navigate to={AppRoutes.login} />}
        />
        <Route path={AppRoutes.login} element={<Login />} />
        <Route path={AppRoutes.register} element={<Register />} />
        <Route path={AppRoutes.pageNotFound} element={<PageNotFound />} />
        <Route path="*" element={<Navigate to={AppRoutes.pageNotFound} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
