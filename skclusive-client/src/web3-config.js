// @ts-check

import Web3 from "web3";

export default function getWeb3Config() {

  const key = "__eth__account__";

  // @ts-ignore
  let value = localStorage.getItem(key);
  if (!value) {
    const web3 = new Web3();
    value = JSON.stringify(web3.eth.accounts.create());
    // @ts-ignore
    localStorage.setItem(key, value);
  }

  const account = JSON.parse(value);

  const provider = "websocket";

  return { account, provider };
}
