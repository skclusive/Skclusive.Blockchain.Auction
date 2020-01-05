// @ts-check

// @ts-ignore
import auctions from "../artifacts/Auctions.json";

import Contract from "./Contract";

import mapper from "../utils/mapper";

export default class Auctions extends Contract {
  constructor(binary, web3, options = {}) {
    super(binary, web3, options);
  }

  static create(web3 = undefined, options = undefined) {
    return new Auctions(auctions, web3, options);
  }

  static at(address, web3 = undefined, options = undefined) {
    return new Auctions({ ...auctions, address }, web3, options);
  }

  onAuctionCreated(callback, options = {}) {
    return this._event(
      "AuctionCreated",
      auction =>
        callback({
          ...auction,
          hasEnded: false,
          highestBid: 0,
          highestBidder: "0x0000000000000000000000000000000000000000"
        }),
      options
    );
  }

  onAuctionEnded(callback, options = {}) {
    return this._event(
      "AuctionEnded",
      auction =>
        callback({
          ...auction,
          hasEnded: true
        }),
      options
    );
  }

  async addAuction(auction, options = {}) {
    return this._func("addAuction", auction, options);
  }

  async endAuction(auction, options = {}) {
    return this._func("endAuction", auction, options);
  }

  async getAuctions(options = {}) {
    return this._func("getAuctions", options);
  }

  async getAuctionState(auction, options = {}) {
    return this._func("getAuctionState", auction, options);
  }

  async getAuctionStates(options = {}) {
    const states = await this._func("getAuctionStates", options);
    return mapper(states, {
      addrezzes: "addrezz",
      names: "name",
      descriptions: "description",
      images: "image",
      biddingEnds: "biddingEnd",
      revealEnds: "revealEnd",
      hasEndeds: "hasEnded",
      highestBidders: "highestBidder",
      highestBids: "highestBid",
      beneficiaries: "beneficiary"
    });
  }
}
