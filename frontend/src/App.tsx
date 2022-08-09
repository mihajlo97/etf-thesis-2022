/* eslint-disable @typescript-eslint/no-unused-vars */
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';

import { AuthGuard } from './components/auth/auth-guard/auth-guard';
import { Main } from './components/layout/main/main';
import { Login } from './components/pages/login/login';
import { Logout } from './components/pages/logout/logout';
import { PageNotFound } from './components/pages/page-not-found/page-not-found';
import { Register } from './components/pages/register/register';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { Reports } from './components/pages/reports/reports';
import { AppRoutes } from './consts/routes.consts';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={AppRoutes.root}
          element={
            <AuthGuard>
              <Navigate to={AppRoutes.dashboard} />
            </AuthGuard>
          }
        />
        <Route path={AppRoutes.login} element={<Login />} />
        <Route path={AppRoutes.logout} element={<Logout />} />
        <Route path={AppRoutes.register} element={<Register />} />
        <Route
          path={AppRoutes.dashboard}
          element={
            <AuthGuard>
              <Main component={<Dashboard />} />
            </AuthGuard>
          }
        />
        <Route
          path={AppRoutes.reports}
          element={
            <AuthGuard>
              <Main component={<Reports />} />
            </AuthGuard>
          }
        />
        <Route path={AppRoutes.pageNotFound} element={<PageNotFound />} />
        <Route path="*" element={<Navigate to={AppRoutes.pageNotFound} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
