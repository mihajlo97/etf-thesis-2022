import React from "react";

import { SwitchDashboardView } from "../../../../model/dashboard.model";

import { Spinner } from "../../../UI/spinner/spinner";

export interface WaitingProps {
  text: string;
  transition: SwitchDashboardView;
}

export const Waiting = ({ text, transition }: WaitingProps) => {
  return (
    <React.Fragment>
      <div>
        <div className="uk-flex uk-flex-center">
          <Spinner />
        </div>
        <p>{text}</p>
      </div>
    </React.Fragment>
  );
};
