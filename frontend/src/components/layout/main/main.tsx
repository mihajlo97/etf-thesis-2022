import React from 'react';
import { clearSessionExpiredLogout } from '../../../service/auth.service';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

export interface MainProps {
  component: JSX.Element;
}

export const Main = ({ component }: MainProps) => {
  clearSessionExpiredLogout();

  return (
    <>
      <Header />
      {component}
      <Footer />
    </>
  );
};
