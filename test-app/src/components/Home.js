import Promise from 'bluebird';
import { reddit } from 'connected-profiles';
import { development as contracts } from 'connected-profiles/lib/contracts';
import React, { Component } from 'react';
import { waitForContract } from 'transaction-monad/lib/utils';
import Web3 from 'web3';


export default class ConnectButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    const web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    const web3 = new Web3(web3Provider);
    const getAccounts = Promise.promisify(web3.eth.getAccounts);
    const accounts = await getAccounts();

    const deployTx = {
      from: accounts[0],
      data: contracts.UportRegistry.binary,
      gas: 1000000,
    };
    const sendTransaction = Promise.promisify(web3.eth.sendTransaction);
    const txhash = await sendTransaction(deployTx);
    const registryAddress = await waitForContract(txhash, web3Provider);

    const options = {
      contracts: {
        UportRegistry: {
          ...contracts.UportRegistry,
          address: registryAddress,
        },
      },
      ipfsProvider: {
        host: 'ipfs.infura.io',
        port: '5001',
        protocol: 'https',
      },
      redirectUri: 'http://localhost:3000/oauth/reddit',
      web3Provider,
      appName: 'Connected Profiles Test App',
      appUrl: 'http://localhost:3000/',
      ipfsBasePath: 'https://ipfs.infura.io/ipfs/',
      txBasePath: 'https://test.ether.camp/transaction/',
    };
    const claimRecord = await reddit.prove.proveLoggedInUsername(accounts[0], options);
    console.log(claimRecord);
  }

  render() {
    return (
      <button className="btn btn-default" onClick={this.handleClick}>Connect with Reddit</button>
    );
  }
}
