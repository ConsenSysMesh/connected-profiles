import Promise from 'bluebird';
import hello from 'hellojs';
import indentString from 'indent-string';
import ipfs from 'ipfs-js';
import pick from 'lodash/pick';
import uport from 'uport-registry';
import './init';
import { proofTitle, proofText, proofUpdateText } from './templates';
import { ProofOptions } from '../options';
import setAttributes from '../../set-attributes';


export function init(options) {
  hello('reddit').init(options);
}

export function login(options) {
  const helloClient = options.helloClient || hello('reddit');
  return helloClient.login({
    force: false,
    redirect_uri: options.redirectUri,
    scope: 'identity submit edit',
  });
}

export async function getLoggedInUsername(options) {
  await login(options);
  const helloClient = options.helloClient || hello('reddit');
  const user = await helloClient.api('api/v1/me');
  return user.name;
}

function getAppInfo(options = {}) {
  let appInfo = pick(options, ['appName', 'appUrl']);
  if (appInfo.appName == null || appInfo.appUrl == null) {
    appInfo = { appName: 'Benefactory', appUrl: 'http://www.benefactory.cc' };
  }
  return appInfo;
}

export async function publishProofToReddit(address, username, options = {}) {
  const appInfo = getAppInfo(options);
  const title = proofTitle({ ...appInfo, address });
  const text = proofText({ ...appInfo, address, username });
  const helloClient = options.helloClient || hello('reddit');
  const result = await helloClient.api('api/submit', 'post', {
    sr: 'UportProofs',
    kind: 'self',
    sendreplies: false,
    title,
    text,
  });

  // result.jquery is an ugly data structure that seems intended for passing
  // to jQuery for updating Reddit's UI. Stringify it and regex out the
  // submission URL.
  const linkPattern = /"([^"]+?\/comments\/[^"]+?)"/;
  const match = linkPattern.exec(JSON.stringify(result));
  return match[1];
}

export function usernameClaim(address, username, url) {
  // Username claims are unsigned, as most self claims will likely be. Signed
  // claims will have a signature and optional header fields alongside the payload.

  // Each account claim is a list. When these claims are fetched,
  // they can be combined to provide a list of all accounts. If there's just
  // one account claim, the value will be a list regardless.
  return {
    payload: {
      claim: {
        account: [{
          '@type': 'Account',
          'service': 'reddit',
          'identifier': username,
          'proofType': 'http',
          'proofUrl': url,
        }],
      },
      subject: { address },
    },
  };
}

export async function registerClaim(claimRecord, options) {
  const { web3Provider, ipfsProvider, contracts, txOptions = {}} = options;
  uport.setWeb3Provider(web3Provider);
  uport.setIpfsProvider(ipfsProvider);
  ipfs.setProvider(ipfsProvider);

  const subjectAddress = claimRecord.payload.subject.address;
  let fetchedRecords = null;
  try {
    fetchedRecords = await uport.getAttributes(
      contracts.UportRegistry.address, subjectAddress);
  } catch (err) {
    // An error is thrown when no attributes have been registered.
  }
  const existingRecords = fetchedRecords || [];
  const updatedRecords = existingRecords.concat(claimRecord);

  // Manually store the updated records in IPFS so we can get the hash.
  const addJson = Promise.promisify(ipfs.addJson);
  const ipfsHash = await addJson(updatedRecords);

  const txhash = await setAttributes(contracts, updatedRecords, {
    provider: web3Provider,
    ipfsProvider,
    txOptions: { from: subjectAddress, ...txOptions },
  });
  return { tx: txhash, ipfs: ipfsHash };
}

export function renderUpdatedProof(claimRecord, hashes, options = {}) {
  const ipfsBasePath = options.ipfsBasePath || 'https://gateway.ipfs.io/ipfs/';
  const txBasePath = options.txBasePath || 'https://live.ether.camp/transaction/';
  const ipfsUrl = ipfsBasePath + hashes.ipfs;
  const txUrl = txBasePath + hashes.tx;
  const appInfo = getAppInfo(options);
  const account = claimRecord.payload.claim.account[0];
  return proofUpdateText({
    ...appInfo,
    address: claimRecord.payload.subject.address,
    username: account.identifier,
    claimRecord: indentString(JSON.stringify(claimRecord, null, 2), 4),
    ipfsUrl,
    txUrl,
  });
}

function thingIdForClaim(claimRecord) {
  // Parse the post ID from the URL.
  const account = claimRecord.payload.claim.account[0];
  const idPattern = /\/comments\/(\w+)/;
  const postId = idPattern.exec(account.proofUrl)[1];
  return 't3_' + postId;
}

export async function updateProofOnReddit(claimRecord, hashes, options = {}) {
  const helloClient = options.helloClient || hello('reddit');
  await helloClient.api('api/editusertext', 'post', {
    api_type: 'json',
    thing_id: thingIdForClaim(claimRecord),
    text: renderUpdatedProof(claimRecord, hashes, options),
  });
}

/**
 * Post an Ethereum address to Reddit and send a transaction referring to the post.
 *
 * hello.js must be initialized with a Reddit client ID before this can be
 * called. e.g.: hello('reddit').init({ reddit: 'CLIENT-ID' })
 *
 * @return {object} The claim record that was registered on the blockchain.
 */
export async function proveLoggedInUsername(address, options) {
  const proofOptions = ProofOptions(options);
  const username = await getLoggedInUsername(proofOptions);
  const proofUrl = await publishProofToReddit(address, username, proofOptions);
  const claimRecord = usernameClaim(address, username, proofUrl);
  const hashes = await registerClaim(claimRecord, proofOptions);
  await updateProofOnReddit(claimRecord, hashes, proofOptions);
  return { claimRecord, hashes };
}
