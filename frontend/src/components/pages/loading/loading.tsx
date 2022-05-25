import React from "react";
import { Spinner } from "../../UI/spinner/spinner";

export const Loading = () => {
  return (
    <React.Fragment>
      <div className="uk-flex uk-flex-row uk-flex-center uk-margin-large-top">
        <div className="uk-card uk-width-1-2@m">
          <Spinner />
        </div>
      </div>
    </React.Fragment>
  );
};
