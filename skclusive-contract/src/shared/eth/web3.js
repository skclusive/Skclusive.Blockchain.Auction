// @ts-check

import getWeb3Config from "../../web3-config";

import factory from "./factory";

import config from "./config";

import Providers from "./providers";

const { account, provider } = getWeb3Config();

const host = config.geth.host[provider];

const Provider = Providers[provider];

export function web3(
  address = account.address,
  privateKey = account.privateKey
) {
  return factory(
    {
      address,
      privateKey
    },
    Provider,
    host,
    {
      // timeout: 30000000,
      headers: {
        Origin: "blockchain"
      },
      clientConfig: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000
      }
    }
  );
}

export default web3();
