const Migrations = artifacts.require('Migrations');
const UportRegistry = artifacts.require('UportRegistry');


module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(UportRegistry);
};
