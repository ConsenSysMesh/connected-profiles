import Promise from 'bluebird';
import hello from 'hellojs';
import indentString from 'indent-string';
import ipfs from 'ipfs-js';
import _ from 'lodash';
import t from 'tcomb';
import uport from 'uport-registry';


hello.init({
  reddit: {
    name: 'Reddit',
    oauth: {
      version: '2',
      auth: 'https://www.reddit.com/api/v1/authorize',
      grant: 'https://www.reddit.com/api/v1/access_token',
    },
    refresh: true,
    base: 'https://oauth.reddit.com/',
    xhr(payload) {
      const token = payload.query.access_token;
      delete payload.query.access_token;
      if (token) {
        payload.headers = {
          Authorization: `Bearer ${token}`,
        };
      }
      return true;
    },
  },
});

const proofTitle = _.template("I control Ethereum account ${address}.");

const PROOF_TEXT_TEMPLATE = "\
I'm posting this to prove that **/u/${username}** controls the Ethereum account \
**${address}**. This proof lets me use my username in [${appName}](${appUrl}) \
and in any other Ethereum-based app.\
";
const proofText = _.template(PROOF_TEXT_TEMPLATE);

const proofUpdateText = _.template(PROOF_TEXT_TEMPLATE + "\n\
\n\
I registered this proof with a [transaction](${txUrl}) that contains a \
[reference to my claim](${ipfsUrl}). That claim is reproduced below.\n\
\n\
${claimRecord}\n\
");


export async function getLoggedInUsername(options) {
  const helloClient = options.helloClient || hello('reddit');
  await helloClient.login({
    redirect_uri: options.redirectUri,
    scope: 'identity submit edit',
  });

  const user = await helloClient.api('api/v1/me');
  return user.name;
}

function getAppInfo(options = {}) {
  let appInfo = _.pick(options, ['appName', 'appUrl']);
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
  const { web3Provider, ipfsProvider, registryAddress } = options;
  uport.setWeb3Provider(web3Provider);
  uport.setIpfsProvider(ipfsProvider);
  ipfs.setProvider(ipfsProvider);

  const subjectAddress = claimRecord.payload.subject.address;
  let fetchedRecords = null;
  try {
    fetchedRecords = await uport.getAttributes(registryAddress, subjectAddress);
  } catch (err) {
    console.error(err);
  }
  const existingRecords = fetchedRecords || [];
  const updatedRecords = existingRecords.concat(claimRecord);

  // Manually store the updated records in IPFS so we can get the hash.
  const addJson = Promise.promisify(ipfs.addJson);
  const ipfsHash = await addJson(updatedRecords);

  const txhash = await uport.setAttributes(
    registryAddress, updatedRecords, { from: subjectAddress });
  return { tx: txhash, ipfs: ipfsHash };
}

export async function updateProofOnReddit(claimRecord, hashes, options = {}) {
  const ipfsBasePath = options.ipfsBasePath || 'https://gateway.ipfs.io/ipfs/';
  const txBasePath = options.txBasePath || 'https://live.ether.camp/transaction/';
  const ipfsUrl = ipfsBasePath + hashes.ipfs;
  const txUrl = txBasePath + hashes.tx;

  const appInfo = getAppInfo(options);
  const account = claimRecord.payload.claim.account[0];
  const text = proofUpdateText({
    ...appInfo,
    address: claimRecord.payload.subject.address,
    username: account.identifier,
    claimRecord: indentString(JSON.stringify(claimRecord, null, 2), 4),
    ipfsUrl,
    txUrl,
  });

  const idPattern = /\/comments\/(\w+)/;
  const postId = idPattern.exec(account.proofUrl)[1];
  const thingId = 't3_' + postId;

  const helloClient = options.helloClient || hello('reddit');
  await helloClient.api('api/editusertext', 'post', {
    api_type: 'json',
    thing_id: thingId,
    text,
  });
}

export const ProofOptions = t.struct({
  ipfsProvider: t.Object,
  redirectUri: t.String,
  registryAddress: t.String,
  web3Provider: t.Object,
  appName: t.maybe(t.String),
  appUrl: t.maybe(t.String),
  helloClient: t.maybe(t.Object),
  ipfsBasePath: t.maybe(t.String),
  txBasePath: t.maybe(t.String),
}, 'ProofOptions');

export async function proveLoggedInUsername(address, options) {
  const proofOptions = ProofOptions(options);
  const username = await getLoggedInUsername(proofOptions);
  const proofUrl = await publishProofToReddit(address, username, proofOptions);
  const claimRecord = usernameClaim(address, username, proofUrl);
  const hashes = await registerClaim(claimRecord, proofOptions);
  await updateProofOnReddit(claimRecord, hashes, proofOptions);
  return claimRecord;
}

export function getUsername(address, { loaders }) {

}

export function verifyUsername(address) {

}
