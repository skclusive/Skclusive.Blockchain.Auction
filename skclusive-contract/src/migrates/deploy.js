// @ts-check

import compile from "./compile";

(async () => {
  const registration = await compile(
    "Registration",
    ["Ownable", "Notifiable"],
    {
      gas: "900000000"
    }
  );
  const auctions = await compile(
    "Auctions",
    ["Ownable", "Notifiable", "Auction", "Registration"],
    {
      gas: "900000000"
    }
  );
  const auction = await compile(
    "Auction",
    ["Ownable", "Notifiable", "Registration"],
    {
      gas: "900000000"
    },
    "Test",
    "Test Contract",
    "data:ER$#%",
    2 * 60 * 60,
    1 * 60 * 60,
    "0x6c15C74e58f10b3710201c3dfa259F37CddC545d",
    registration
  );
  const ethRequest = await compile(
    "EtherRequest",
    ["Ownable", "Notifiable", "Registration"],
    {
      gas: "900000000"
    },
    registration
  );
})();
