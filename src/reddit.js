import hello from 'hellojs';


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

const PROOF_TEMPLATE = "\
I'm posting this to prove that **/u/${username}** controls the Ethereum account, \
**${address}**.\
";

const PROOF_UPDATE_TEMPLATE = "\
I'm posting this to prove that **/u/${username}** controls the Ethereum account, \
**${address}**.\n\
\n\
I registered this claim with a [transaction](${txUrl}) referring to a \
[cryptographic proof](${ipfsUrl}) that only my signing key can create. \
That proof is reproduced below.\n\
\n\
```\n\
${tokenRecord}\n\
```\n\
";

export function getLoggedInUsername() {

}

export function publishProofToReddit(address, username) {

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
