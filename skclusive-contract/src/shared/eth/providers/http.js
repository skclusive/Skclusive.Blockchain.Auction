// @ts-check

import HookedProvider from "hooked-web3-provider";

export default class HttpProvider extends HookedProvider {
  constructor(host, options, signer) {
    super({
      host,
      transaction_signer: signer
    });
  }
}
