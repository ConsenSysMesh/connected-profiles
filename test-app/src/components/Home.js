import * as reddit from 'connected-profiles/lib/reddit';
import hello from 'hellojs';
import React, { Component } from 'react';


export default class ConnectButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    const options = { redirectUri: 'http://localhost:3000/oauth/reddit' };
    const username = await reddit.getLoggedInUsername(options);
    const proofUrl = await reddit.publishProofToReddit('0xdeadbeef', username);
    console.error(proofUrl);
  }

  render() {
    return (
      <button className="btn btn-default" onClick={this.handleClick}>Connect with Reddit</button>
    );
  }
}
