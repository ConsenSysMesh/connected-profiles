import t from 'tcomb';


export const ProofOptions = t.struct({
  contracts: t.Object,
  ipfsProvider: t.Object,
  redirectUri: t.String,
  web3Provider: t.Object,
  appName: t.maybe(t.String),
  appUrl: t.maybe(t.String),
  helloClient: t.maybe(t.Object),
  ipfsBasePath: t.maybe(t.String),
  txBasePath: t.maybe(t.String),
  txOptions: t.maybe(t.Object),
}, 'ProofOptions');
