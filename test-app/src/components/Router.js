import React from 'react';
import { Router as ReactRouter, Route, browserHistory } from 'react-router';
import Home from './Home';
import OauthReddit from './OauthReddit';

import '../../vendor/bootstrap/css/bootstrap.min.css';
import '../../vendor/bootstrap/css/bootstrap-theme.min.css';


export default () => (
  <ReactRouter history={browserHistory}>
    <Route path="/" component={Home} />
    <Route path="oauth/reddit" component={OauthReddit} />
  </ReactRouter>
);
