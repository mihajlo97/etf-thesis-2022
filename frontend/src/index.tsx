import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/js/uikit.min.js';
import './assets/sass/styles.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
