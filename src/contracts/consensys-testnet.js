import Collector from './collector';
import UportRegistryLoader from '../environments/consensys-testnet/contracts/UportRegistry.sol.js';

const collector = new Collector();
UportRegistryLoader.load(collector);

export default collector.contracts;
