// @ts-check

import Registration from "../shared/contracts/Registration";

import Auctions from "../shared/contracts/Auctions";

import Auction from "../shared/contracts/Auction";

const auctions = Auctions.create();

const registration = Registration.create();

export default class Controller {
  static async create(auction) {
    console.log(`about to create auction..`, auction);

    const {
      name = "<Auction Name>",
      description = "<Auction Description>",
      image = "<Auction Image>",
      gas = "3812818",
      beneficiary = "0x6c15C74e58f10b3710201c3dfa259F37CddC545d",
      biding = 2 * 60 * 60,
      reveal = 1 * 60 * 60
    } = auction;

    const contract = Auction.create();

    const address = await contract.deploy(
      {
        gas
      },
      name,
      description,
      image,
      biding,
      reveal,
      beneficiary,
      registration.address
    );

    console.info(`Auction deployed at ${address}`);

    await auctions.addAuction(address);


    console.info(`Auction deployed and added at ${address}`);

    return address;
  }

  static async end(auction) {
    const { address } = auction;

    const contract = Auction.at(address);

    const result = await contract.auctionEnd();

    await auctions.endAuction(address);

    return result;
  }
}
