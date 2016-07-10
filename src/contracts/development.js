import Collector from './collector';
import UportRegistryLoader from '../environments/development/contracts/UportRegistry.sol.js';

const collector = new Collector();
UportRegistryLoader.load(collector);

export default collector.contracts;
