// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":true,"inputs":[{"name":"personaAddress","type":"address"}],"name":"getAttributes","outputs":[{"name":"","type":"bytes"}],"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"previousPublishedVersion","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"ipfsHash","type":"bytes"}],"name":"setAttributes","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ipfsAttributeLookup","outputs":[{"name":"","type":"bytes"}],"type":"function"},{"inputs":[{"name":"_previousPublishedVersion","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_sender","type":"address"},{"indexed":false,"name":"_timestamp","type":"uint256"}],"name":"AttributesSet","type":"event"}],
    binary: "6060604052604051602080610393833950608060405251600160008190558054600160a060020a03191682179055506103578061003c6000396000f3606060405260e060020a6000350463446d5aa4811461004757806354fd4d50146100be5780636104464f146100c75780636737c877146100d9578063884179d814610192575b005b6101fd60043560006060818152600160a060020a0383168252600260208181526040938490208054600181161561010002600019011692909204601f810182900490910260a090810190945260808181529293828280156102a05780601f10610275576101008083540402835291602001916102a0565b61026b60005481565b61026b600154600160a060020a031681565b60206004803580820135601f81018490049093026080908101604052606084815261004594602493919291840191819083828082843750949650505050505050600160a060020a0333166000908152600260208181526040832084518154828652948390209194600181161561010002600019011693909304601f90810192909204810192916080908390106102ac57805160ff19168380011785555b506102dc9291505b80821115610320576000815560010161017e565b6101fd60043560026020818152600092835260409283902080546080601f60001961010060018516150201909216949094049081018390049092028301909352606081815292918282801561034f5780601f106103245761010080835404028352916020019161034f565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561025d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6060908152602090f35b820191906000526020600020905b81548152906001019060200180831161028357829003601f168201915b50505050509050919050565b82800160010185558215610176579182015b828111156101765782518260005055916020019190600101906102be565b5050604080514281529051600160a060020a033316917f70c8251d1f51f94ab26213a0dd53ead1bf32aeeb2e95bb6497d8d8bbde61b98d919081900360200190a250565b5090565b820191906000526020600020905b81548152906001019060200180831161033257829003601f168201915b50505050508156",
    unlinked_binary: "6060604052604051602080610393833950608060405251600160008190558054600160a060020a03191682179055506103578061003c6000396000f3606060405260e060020a6000350463446d5aa4811461004757806354fd4d50146100be5780636104464f146100c75780636737c877146100d9578063884179d814610192575b005b6101fd60043560006060818152600160a060020a0383168252600260208181526040938490208054600181161561010002600019011692909204601f810182900490910260a090810190945260808181529293828280156102a05780601f10610275576101008083540402835291602001916102a0565b61026b60005481565b61026b600154600160a060020a031681565b60206004803580820135601f81018490049093026080908101604052606084815261004594602493919291840191819083828082843750949650505050505050600160a060020a0333166000908152600260208181526040832084518154828652948390209194600181161561010002600019011693909304601f90810192909204810192916080908390106102ac57805160ff19168380011785555b506102dc9291505b80821115610320576000815560010161017e565b6101fd60043560026020818152600092835260409283902080546080601f60001961010060018516150201909216949094049081018390049092028301909352606081815292918282801561034f5780601f106103245761010080835404028352916020019161034f565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561025d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6060908152602090f35b820191906000526020600020905b81548152906001019060200180831161028357829003601f168201915b50505050509050919050565b82800160010185558215610176579182015b828111156101765782518260005055916020019190600101906102be565b5050604080514281529051600160a060020a033316917f70c8251d1f51f94ab26213a0dd53ead1bf32aeeb2e95bb6497d8d8bbde61b98d919081900360200190a250565b5090565b820191906000526020600020905b81548152906001019060200180831161033257829003601f168201915b50505050508156",
    address: "0xa9be82e93628abaac5ab557a9b3b02f711c0151c",
    generated_with: "2.0.9",
    contract_name: "UportRegistry"
  };

  function Contract() {
    if (Contract.Pudding == null) {
      throw new Error("UportRegistry error: Please call load() first before creating new instance of this contract.");
    }

    Contract.Pudding.apply(this, arguments);
  };

  Contract.load = function(Pudding) {
    Contract.Pudding = Pudding;

    Pudding.whisk(contract_data, Contract);

    // Return itself for backwards compatibility.
    return Contract;
  }

  Contract.new = function() {
    if (Contract.Pudding == null) {
      throw new Error("UportRegistry error: Please call load() first before calling new().");
    }

    return Contract.Pudding.new.apply(Contract, arguments);
  };

  Contract.at = function() {
    if (Contract.Pudding == null) {
      throw new Error("UportRegistry error: Please call load() first before calling at().");
    }

    return Contract.Pudding.at.apply(Contract, arguments);
  };

  Contract.deployed = function() {
    if (Contract.Pudding == null) {
      throw new Error("UportRegistry error: Please call load() first before calling deployed().");
    }

    return Contract.Pudding.deployed.apply(Contract, arguments);
  };

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of Pudding in the browser,
    // and we can use that.
    window.UportRegistry = Contract;
  }

})();
