import Promise from 'bluebird';
import { expect } from 'chai';
import TestRPC from 'ethereumjs-testrpc';
import sinon from 'sinon';
import { waitForContract, waitForReceipt } from 'transaction-monad/lib/utils';
import uport from 'uport-registry';
import Web3 from 'web3';
import * as contracts from '../../src/contracts';
import setAttributes from '../../src/set-attributes';
import { ProfileLoader, UsernameLoader } from '../../src/services/reddit/loaders';
import { IpfsProviderStub } from '../_utils/ipfs';

global.Promise = Promise;  // Use bluebird for better error logging during development.

const UPORT_PROFILE = '[{"payload":{"claim":{"account":[{"@type":"Account","service":"reddit","identifier":"natrius","proofType":"http","proofUrl":"https://www.reddit.com/r/UportProofs/comments/4s4ihf/i_control_ethereum_account/"}]},"subject":{"address":"0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"}}}]';
const UPORT_PROFILE_HASH = 'QmWiN11H6ZgQY2ZVjwLrtDVeJ3uU2vKbVWmUz5jVr1xZ2k';

describe('loaders', () => {
  let registryAddress;
  let sender;
  let ipfsProvider;
  let web3Provider;

  before(async function () {
    web3Provider = TestRPC.provider({ seed: 'TestRPC is awesome!' });
    const web3 = new Web3(web3Provider);
    const getAccounts = Promise.promisify(web3.eth.getAccounts);
    const accounts = await getAccounts();
    sender = accounts[0];

    // Deploy a registry.
    const deployTx = {
      from: sender,
      data: contracts.development.UportRegistry.binary,
    };
    const sendTransaction = Promise.promisify(web3.eth.sendTransaction);
    const deployHash = await sendTransaction(deployTx);
    registryAddress = await waitForContract(deployHash, web3Provider);
    const testContracts = {
      UportRegistry: {
        ...contracts.development.UportRegistry,
        address: registryAddress,
      },
    };

    // Stub an IPFS provider with profile data.
    const stubs = { add: sinon.stub(), cat: sinon.stub() };
    stubs.add.returns([null, UPORT_PROFILE_HASH]);
    stubs.cat.returns([null, UPORT_PROFILE]);
    ipfsProvider = new IpfsProviderStub(stubs);

    // Register a profile for sender.
    uport.setWeb3Provider(web3Provider);
    uport.setIpfsProvider(ipfsProvider);
    const txhash = await setAttributes(
      testContracts,
      JSON.parse(UPORT_PROFILE),
      {
        provider: web3Provider,
        ipfsProvider,
        txOptions: { from: sender },
      }
    );
    await waitForReceipt(txhash, web3Provider);
  });

  it('fetches profile', async function () {
    const loader = new ProfileLoader({ registryAddress, ipfsProvider, web3Provider });
    const profile = await loader.load(sender);
    expect(profile).to.deep.equal({
      address: sender,
      attributes: JSON.parse(UPORT_PROFILE),
    });
  });

  it('fetches username', async function () {
    const loader = new UsernameLoader({ registryAddress, ipfsProvider, web3Provider });
    const usernameData = await loader.load(sender);
    expect(usernameData).to.deep.equal({
      address: sender,
      username: 'natrius',
    });
  });

  it('handles addresses without usernames', async function () {
    const anonymous = '0xa94b7f0465e98609391c623d0560c5720a3f2d33';
    const loader = new UsernameLoader({ registryAddress, ipfsProvider, web3Provider });
    const usernameData = await loader.load(anonymous);
    expect(usernameData).to.deep.equal({
      address: anonymous,
      username: null,
    });
  });
});
