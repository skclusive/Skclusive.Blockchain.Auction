import Transaction from "ethereumjs-tx";

export function hex(web3, tx) {
    const rawTx = {
      from: web3.utils.toHex(tx.from),
      to: web3.utils.toHex(tx.to),
      data: web3.utils.toHex(tx.data || ""),
      value: web3.utils.toHex(tx.value || "00"),
      gasPrice: web3.utils.toHex(tx.gasPrice),
      nonce: web3.utils.toHex(tx.nonce)
    };
  
    if (tx.gas) {
      rawTx.gas = web3.utils.toHex(tx.gas);
    }
  
    return rawTx;
  }
  
  export function signer(account, privateKey) {
    return async function sign(web3, tx) {
      if (!tx.from) {
        tx.from = account;
      }
      if (account.toLowerCase() !== tx.from.toLowerCase()) {
        throw new Error(
          `Transaction from account ${tx.from} is not of the signer ${account}`
        );
      }
      const [nonce, price] = await Promise.all([
        tx.nonce
          ? Promise.resolve(tx.nonce)
          : web3.eth.getTransactionCount(tx.from),
        tx.gasPrice ? Promise.resolve(tx.gasPrice) : web3.eth.getGasPrice()
      ]);
  
      tx.gasPrice = price;
      tx.nonce = nonce;
  
      const transaction = new Transaction(hex(web3, tx));
  
      transaction.sign(Buffer.from(privateKey, "hex"));
  
      const serializedTx = transaction.serialize();
  
      const txHex = serializedTx.toString("hex");
  
      return `0x${txHex}`;
    };
  }