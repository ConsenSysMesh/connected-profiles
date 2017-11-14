import 'babel-polyfill';
import Promise from 'bluebird';
global.Promise = Promise;

import { reddit } from 'connected-profiles';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './components/router';


reddit.prove.init({ reddit: '7ExbTYSD-1K2yw' });

ReactDOM.render(
  <Router />,
  document.getElementById('root')
);
