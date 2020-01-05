// @ts-check

import web3 from "../eth/web3";

export default class Contract {
  constructor(binary, _web3 = web3, options = {}) {
    this.web3 = _web3;
    this.address = binary.address;
    this.abi = binary.abi;
    this.bytecode = binary.bytecode;

    this.contract = new this.web3.eth.Contract(this.abi, this.address, {
      ...options,
      from: this.web3.eth.defaultAccount
    });
  }

  getOptions(opts) {
    return {
      from: this.web3.eth.defaultAccount,
      gas: "2000000",
      gasPrice: "10000000000",
      ...opts
    };
  }

  async deploy(opts, ...args) {
    const options = this.getOptions(opts);
    const contract = await this.contract
      .deploy({
        data: this.bytecode,
        arguments: args
      })
      .send(options);
    this.contract = contract;
    this.address = this.contract.options.address;
    return this.address;
  }

  _func(name, ...rest) {
    const args = rest.slice(0, -1);
    const opts = rest[rest.length - 1];
    const invocation = this.contract.methods[name](...args);
    const def = this.abi.find(f => f.type === "function" && f.name === name);
    const options = this.getOptions(opts);
    return def.constant ? invocation.call(options) : invocation.send(options);
  }

  _event(name, callback, options) {
    const handler = result => callback(result.returnValues);
    const emitter = this.contract.events[name](options);
    emitter.on("data", handler);
    return () => {
      emitter.off("data", handler);
    };
  }

  onNotify(callback, options = {}) {
    return this._event("Notify", callback, options);
  }

  onWinner(callback, options = {}) {
    return this._event("Winner", callback, options);
  }
}
