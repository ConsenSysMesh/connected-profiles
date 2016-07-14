import DataLoader from 'dataloader';
import uport from 'uport-registry';


export function profileFetcher(options) {
  const { registryAddress } = options;
  return function getProfiles(addresses) {
    const profilePromises = addresses.map(address => {
      return uport.getAttributes(registryAddress, address)
        .then((profile) => ({ address, profile }));
    });
    return Promise.all(profilePromises);
  };
}

export class ProfileLoader extends DataLoader {
  constructor(options, loaderOptions) {
    super(profileFetcher(options), loaderOptions);
  }
}
