import React from "react";
import { Footer } from "../footer/footer";
import { Header } from "../header/header";

export interface MainProps {
  component: JSX.Element;
}

export const Main = ({ component }: MainProps) => {
  return (
    <React.Fragment>
      <Header />
      {component}
      <Footer />
    </React.Fragment>
  );
};
