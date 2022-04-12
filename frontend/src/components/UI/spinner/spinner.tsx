/* eslint-disable jsx-a11y/alt-text */
import React from "react";

export const Spinner = () => {
  return (
    <React.Fragment>
      <img src={`${process.env.PUBLIC_URL}/assets/spinner.svg`} />
    </React.Fragment>
  );
};
