import hello from 'hellojs';
import _ from 'lodash';


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

const proofText = _.template("\
I'm posting this to prove that **/u/${username}** controls the Ethereum account, \
**${address}**.\
");

const proofUpdateText = _.template(proofTitle.source + "\n\
\n\
I registered this claim with a [transaction](${txUrl}) referring to a \
[cryptographic proof](${ipfsUrl}) that only my signing key can create. \
That proof is reproduced below.\n\
\n\
```\n\
${tokenRecord}\n\
```\n\
");


export async function getLoggedInUsername(options) {
  const helloReddit = options.helloReddit || hello('reddit');
  await helloReddit.login({
    redirect_uri: options.redirectUri,
    scope: 'identity submit edit',
  });

  const user = await helloReddit.api('api/v1/me');
  return user.name;
}

export async function publishProofToReddit(address, username, options = {}) {
  const title = proofTitle({ address });
  const text = proofText({ address, username });
  const helloReddit = options.helloReddit || hello('reddit');
  const result = await helloReddit.api('api/submit', 'post', {
    sr: 'UportProofs',
    kind: 'self',
    sendreplies: false,
    title,
    text,
  });

  // result.jquery is an ugly data structure that seems intended for passing
  // to jQuery for updating Reddit's UI. Stringify it and regex out the
  // submission URL.
  const linkPattern = new RegExp('"([^"]+?/comments/[^"]+?)"');
  const match = linkPattern.exec(JSON.stringify(result));
  return match[1];
}

export function usernameToken(username, url, providers) {
  // Create TokenSigner with the provider.
  // Override Persona.signAttribute with a function that uses the TokenSigner.
  // const tokenRecord = signAttribute(...);
}

export async function publishToken(address, tokenRecord, UportRegistry, providers) {
  const persona = new Persona(address, UportRegistry.address);
  persona.setProviders(providers.ipfs, providers.web3);

  // Load the existing claims.
  await persona.load();

  const txhash = await persona.addClaim(tokenRecord);
  const receipt = await waitForReceipt(txhash);
  return receipt;
}

export function updateProofOnReddit(tokenRecord, txhash) {
  // Get the IPFS hash of the address's current profile.
  // Build a gateway.ipfs.io URL for the current profile.
  // Build an etherscan.io URL for the transaction hash.
  // Update the Reddit post with a new statement containing the token record,
  //   etherscan.io link to prove the transaction, and gateway.ipfs.io URL to
  //   link the data in the transaction to the proof data.
}

export function getUsername(address, { loaders }) {

}

export function verifyUsername(address) {

}
