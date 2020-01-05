// @ts-check

import web3 from "../shared/eth/web3";

export default async function balance() {
  const balanceInWei = await web3.eth.getBalance(web3.eth.defaultAccount);
  return web3.utils.fromWei(balanceInWei, "ether");
}
