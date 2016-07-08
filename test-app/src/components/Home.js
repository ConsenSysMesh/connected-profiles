import hello from 'hellojs';
import React, { Component } from 'react';


export default class ConnectButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    await hello('reddit').login({
      redirect_uri: 'http://localhost:3000/oauth/reddit',
      scope: 'submit edit',
    });

    await hello('reddit').api('api/submit', 'post', {
      sr: 'UportProofs',
      kind: 'self',
      title: 'This is a test',
      text: 'This is the body of my test',
      sendreplies: false,
    });
  }

  render() {
    return (
      <button className="btn btn-default" onClick={this.handleClick}>Connect with Reddit</button>
    );
  }
}
