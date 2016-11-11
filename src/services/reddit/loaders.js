import DataLoader from 'dataloader';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import uport from 'uport-registry';


export function profileFetcher(options) {
  const { registryAddress, ipfsProvider, web3Provider } = options;
  return function getProfiles(addresses) {
    uport.setIpfsProvider(ipfsProvider);
    uport.setWeb3Provider(web3Provider);
    const profilePromises = addresses.map(address => {
      return uport.getAttributes(registryAddress, address)
        .then((attributes) => ({ address, attributes }))
        // uport-registry throws an error for addresses without registered
        // attributes.
        .catch(() => ({ address, attributes: [] }));
    });
    return Promise.all(profilePromises);
  };
}

export class ProfileLoader extends DataLoader {
  constructor(options, loaderOptions) {
    super(profileFetcher(options), loaderOptions);
  }
}

export function usernameAttributeFetcher(options) {
  const profileLoader = options.profileLoader || new ProfileLoader(options);
  return async function getUsernameAttributes(addresses) {
    const profiles = await profileLoader.loadMany(addresses);
    return profiles.map(profile => {
      let attribute = null;
      if (isArray(profile.attributes)) {
        attribute = profile.attributes.find(attr => {
          const claim = get(attr, 'payload.claim');
          if (claim == null || claim.account[0] == null) {
            return false;
          }
          const isRedditClaim = claim.account[0].service === 'reddit';
          const isClaimSubject = get(attr, 'payload.subject.address') === profile.address;
          return isRedditClaim && isClaimSubject;
        });
        attribute = attribute || null;
      }
      return { address: profile.address, attribute };
    });
  };
}

export function usernameFetcher(options) {
  return async function getUsernames(addresses) {
    const usernameAttributes = await usernameAttributeFetcher(options)(addresses);
    return usernameAttributes.map(({ address, attribute }) => ({
      address,
      username: get(attribute, 'payload.claim.account[0].identifier', null),
    }));
  };
}

export class UsernameLoader extends DataLoader {
  constructor(options, loaderOptions) {
    super(usernameFetcher(options), loaderOptions);
  }
}
