/**
 * Export Truffle-generated contract data that can be used without Pudding.
 */
import { collectFromLoaders } from './collector';
import * as loaders from './loaders';


export const consensys = collectFromLoaders(loaders.consensys);
export const development = collectFromLoaders(loaders.development);
export const mainnet = collectFromLoaders(loaders.mainnet);
