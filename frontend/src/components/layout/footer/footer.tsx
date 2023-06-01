/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

export const Footer = () => {
  return (
    <footer>
      <div className="uk-container-expand footer">
        <div className="uk-flex uk-flex-center@m uk-padding uk-margin-xlarge-top">
          <div className="uk-margin-large-right">
            <p>
              {'Developed by Mihajlo Starčević'}
              <br />
              {''}
            </p>
            <p>
              {'School of Electrical Engineering,'}
              <br />
              {'University of Belgrade'}
            </p>
            <p>
              {'Website:'}
              <br />
              <a href="https://www.etf.bg.ac.rs/">{'etf.bg.ac.rs'}</a>
            </p>
          </div>
          <div>
            <p>
              {'Email: '}
              <br />
              <a>{'sm160316d@student.etf.bg.ac.rs'}</a>
              <br />
              <a>{'mihajlomixy@gmail.com'}</a>
            </p>
            <p>
              {'LinkedIn: '}
              <br />
              <a href="https://www.linkedin.com/in/mihajlo-starcevic/">{'linkedin.com/in/mihajlo-starcevic/'}</a>
            </p>
            <p>
              {'Contact: '}
              <br />
              {'+381 64 479 6166'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
