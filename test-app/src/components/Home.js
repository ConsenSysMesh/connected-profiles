import 'connected-profiles/lib/reddit';
import hello from 'hellojs';
import React, { Component } from 'react';


export default class ConnectButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    hello('reddit').login({
      redirect_uri: 'http://localhost:3000/oauth/reddit',
      scope: 'submit edit',
    }).then(() => console.log('logged in'));
  }

  render() {
    return (
      <button className="btn btn-default" onClick={this.handleClick}>Connect with Reddit</button>
    );
  }
}
