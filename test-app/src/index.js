import 'babel-polyfill';
import Promise from 'bluebird';
global.Promise = Promise;

import React from 'react';
import ReactDOM from 'react-dom';
import Router from './components/router';

ReactDOM.render(
  <Router />,
  document.getElementById('root')
);
