import 'babel-polyfill';
import Promise from 'bluebird';
global.Promise = Promise;

import 'connected-profiles/lib/reddit';
import hello from 'hellojs';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './components/router';


hello('reddit').init({ reddit: '7ExbTYSD-1K2yw' });

ReactDOM.render(
  <Router />,
  document.getElementById('root')
);
