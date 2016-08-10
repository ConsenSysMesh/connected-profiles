import _ from 'lodash';
import t from 'tcomb';


const Contract = t.struct({
  abi: t.list(t.Object),
  binary: t.String,
  unlinked_binary: t.String,
  address: t.String,
  generated_with: t.String,
  contract_name: t.String,
}, 'Contract');

// Mock the Pudding interface with a whisk method that collects contract data.
export class Collector {
  constructor() {
    this.contracts = {};
  }

  whisk(contractData) {
    const contractName = contractData.contract_name;
    this.contracts[contractName] = Contract(contractData);
  }
}

export function collectFromLoaders(envLoaders) {
  const collector = new Collector();
  _.forEach(envLoaders, (loader) => loader.load(collector));
  return collector.contracts;
}
