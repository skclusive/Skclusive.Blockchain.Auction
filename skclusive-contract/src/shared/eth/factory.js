// @ts-check

import Web3 from "web3";

import { signer } from "./signer";

export default function factory(account, Provider, host, options = {}) {
  const web3 = new Web3();

  const { address } = account;

  const privateKey = account.privateKey.substring(2);

  const sign = signer(address, privateKey);

  const provider = new Provider(host, options, {
    hasAddress(current, callback) {
      callback(null, current.toLowerCase() === address.toLowerCase());
    },
    async signTransaction(tx_params, callback) {
      callback(null, await sign(web3, tx_params));
    }
  });

  web3.eth.defaultAccount = address;

  // @ts-ignore
  web3.setProvider(provider);

  return web3;
}
