/**
 * uport-registry uses an old version of ether-pudding that breaks
 * in the relatively common scenario of a null response from
 * getTransaction against an Infura node. This implementation just
 * returns the transaction hash so the utilities from transaction-monad
 * can be used to wait for the transaction instead.
 */
import Promise from 'bluebird';
// FIXME: In browsers, package.js replaces ipfs-js with browser-ipfs like
// uport-registry does. It is a terrible practice. We should create
// a library that works in any environment.
import ipfs from 'ipfs-js';
import bs58 from 'bs58';
import Web3 from 'web3';


function base58ToHex(base58Bytes) {
  const hexBuf = new Buffer(bs58.decode(base58Bytes));
  return hexBuf.toString('hex');
}

export default async function setAttributes({ UportRegistry }, personaInfo, { provider, ipfsProvider, txOptions }) {
  ipfs.setProvider(ipfsProvider);
  const web3 = new Web3(provider);
  const RegistryContract = web3.eth.contract(UportRegistry.abi)
    .at(UportRegistry.address);
  const addJson = Promise.promisify(ipfs.addJson);
  const ipfsHash = await addJson(personaInfo);
  const ipfsHashHex = base58ToHex(ipfsHash);
  const set = Promise.promisify(RegistryContract.setAttributes.sendTransaction);
  const txhash = await set('0x' + ipfsHashHex, txOptions);
  return txhash;
}
